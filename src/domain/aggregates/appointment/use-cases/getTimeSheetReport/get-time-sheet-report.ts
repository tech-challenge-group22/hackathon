import NodemailerAdapter from "../../../../../application/adapters/NodemailerAdapter";
import { eventTypeString } from "../../entities/TimeSheetRecord";
import IGateway from "../../interfaces/Gateway";
import IUseCase from "../../interfaces/UseCase";
import { DateItem, Dates, Report, getTimeSheetReportInput } from "./getTimeSheetReportDTO";

export default class GetTimeSheetReport implements IUseCase{
    input:getTimeSheetReportInput;
    gateway:IGateway;
    mailer: NodemailerAdapter;
    mock = `[
        {
          "time": "2024-03-20T22:54:58.330Z",
          "registry_number": "123456",
          "id": "123456"
        },
        {
          "time": "2024-03-19T22:54:58.330Z",
          "registry_number": "6789",
          "id": "78910"
        }
      ]`
    
    constructor(input: getTimeSheetReportInput, gateway: IGateway, mailer: NodemailerAdapter){
        this.gateway = gateway;
        this.input = input;
        this.mailer = mailer;
    }

    async execute(): Promise<any> {
        const result = await this.gateway.getLastMonthReport(this.input.employe_registry_number);
        if(result){
            let dateItems:DateItem[] = [];
            result.forEach((element: any) => {
                let dateItem: DateItem = {
                    time:element.time,
                    time_sheet_id:element.id,
                    event_type: eventTypeString.get(element.event_type)
                }
                dateItems.push(dateItem);
            });
            dateItems = dateItems.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
            const dates = this.groupByDate(dateItems);
            const totalHours = this.totalMonthHours(dateItems, dates);
            let output:Report = {
                employe_registry_number: this.input.employe_registry_number,
                dates: dates,
                work_hours: totalHours
            };

            let formattedReport = `<h2>Matrícula do funcionário: ${output.employe_registry_number}</h2>`;

            for (const date in output.dates) {
                formattedReport += `<p>Data: ${date}</p>`;

                for (const entry of output.dates[date]) {
                    formattedReport += `<p>Hora: ${entry.time}, ${entry.time}</p>`;
                }
            }

            formattedReport += `<br /><p>Total de horas trabalhadas: ${output.work_hours}</p>`;
            
            this.mailer.execute({ to: this.input.employe_email, text: formattedReport })
            return output;
        }
        throw new Error("Method not implemented.");
    }

    private groupByDate(items: DateItem[]): Dates {
        const groupedDates: Dates = {};
        items.forEach(item => {
            const dateKey = new Date(item.time).toLocaleDateString();
            if (!groupedDates[dateKey]) {
                groupedDates[dateKey] = [];
            }
            groupedDates[dateKey].push(item);
        });
        return groupedDates;
    }

    private totalMonthHours(items: DateItem[], groupedDates: Dates){
        let totalHours = 0;
        let countedDates: string[] = [];
        let entryHour;
        let endHour;
        let discountHours = 0;
        let count = 0;
        items.forEach(item => {
            const dateKey:string = new Date(item.time).toLocaleDateString();
            if(countedDates.indexOf(dateKey) == -1){
                let currentEntryInterval;
                let currentEndInterval;
                for (let index = 0; index < groupedDates[dateKey].length; index++) {
                    countedDates.push(dateKey);
                    const item = groupedDates[dateKey][index];
                    if(item.event_type == 'Entrada'){
                        entryHour = item.time;
                    } else if(item.event_type == 'Saida'){
                        endHour = item.time;
                    } else if(item.event_type == 'Intervalo'){
                        count++;
                        if(count == 1){
                            currentEntryInterval = item.time;
                        }else if(count == 2){
                            currentEndInterval = item.time;
                            count = 0;
                            if(currentEntryInterval && currentEndInterval){
                                discountHours += this.calculateHoursBetween(new Date(currentEntryInterval), new Date(currentEndInterval));
                            }
                            currentEntryInterval = null;
                            currentEndInterval = null;
                        }
                    }
                }
            }
        })
        if(entryHour && endHour){
            totalHours = this.calculateHoursBetween(new Date(entryHour), new Date(endHour));
        }
        console.log('totalHours',totalHours);
        totalHours = totalHours - discountHours;
        return Number(totalHours.toFixed(2));
    }

    private calculateHoursBetween(startTime: Date, endTime: Date): number {
        const timeDiff = Math.abs( endTime.getTime() - startTime.getTime());
        const hours = timeDiff / (1000 * 60 * 60);
        console.log('hours',hours)
        return hours;
    }
}