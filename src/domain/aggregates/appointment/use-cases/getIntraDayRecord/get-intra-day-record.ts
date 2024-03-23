import IGateway from "../../interfaces/Gateway";
import IUseCase from "../../interfaces/UseCase";
import { GetIntraDayRecordInputDTO, GetIntraDayRecordOutputDTO, QueryParamsDTO } from "./get-intraday-recordsDTO";
import { DateItem, Dates, Report, getTimeSheetReportInput } from "../getTimeSheetReport/getTimeSheetReportDTO";
import { eventTypeString } from "../../entities/TimeSheetRecord";

export default class GetIntraDayRecord implements IUseCase {
    input: GetIntraDayRecordInputDTO;
    gateway: IGateway;

    mock = `[
        {
          "time": "2024-03-20T22:54:58.330Z",
          "registry_number": "123456",
          "id": "123456"
        }
      ]`

    constructor(input: GetIntraDayRecordInputDTO, gateway: IGateway) {
        this.input = input;
        this.gateway = gateway;
    }

    async execute(input: GetIntraDayRecordInputDTO): Promise<any> {
        try {
            // Buscar registros de ponto para o userId fornecido
            const results = await this.gateway.getIntradayRecordsByRegistryNumber(input.registry_number);
            
            if (results) {
                let dateMarksResults: DateItem[] = [];
                results.forEach((item: any) => {
                    let dateMarksResult: DateItem = {
                        time: item.time,
                        time_sheet_id: item.id,
                        event_type: eventTypeString.get(item.event_type)
                    }
                    dateMarksResults.push(dateMarksResult);
            });

            const marks = this.groupByDate(dateMarksResults);
            const totalHours = this.totalMonthHours(dateMarksResults, marks);
            let output: GetIntraDayRecordOutputDTO = {
                registry_number: this.input.registry_number,
                marks: marks,
                work_hours: totalHours
            };

            return output;
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar registros para a data: ${error.message}`);
            } else {
                // Se não for uma instância de Error, tratar de forma genérica
                throw new Error("Erro desconhecido ao buscar registros para a data.");
            }
        }
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

    private calculateHoursBetween(startTime: Date, endTime: Date): number {
        const timeDiff = Math.abs( endTime.getTime() - startTime.getTime());
        const hours = timeDiff / (1000 * 60 * 60);
        console.log('hours',hours)
        return hours;
    }
}