import IGateway from "../../interfaces/Gateway";
import IUseCase from "../../interfaces/UseCase";
import { EventType, GetIntraDayRecordInputDTO, GetIntraDayRecordOutputDTO, GetIntradayReportOutputDTO } from "./get-intraday-recordsDTO";
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
            
            // Verifica se não há resultados
            if (!results || results.length === 0) {
                // Retorna uma resposta indicando que nenhum registro foi encontrado
                return {
                    registry_number: input.registry_number,
                    marks: [], // Lista vazia de marcas
                    message: "Nenhum registro encontrado para o número de registro fornecido."
                };
            } else {
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
            const totalHours = this.totalWorkHours(dateMarksResults, marks);
            let output: GetIntradayReportOutputDTO = {
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

    private totalWorkHours(items: DateItem[], groupedDates: Dates){
        let totalHours = 0;
        let countedDates: string[] = [];
        let entryHour;
        let endHour;
        items.forEach(item => {
            const dateKey:string = new Date(item.time).toLocaleDateString();
            if(countedDates.indexOf(dateKey) == -1){
                for (let index = 0; index < groupedDates[dateKey].length; index++) {
                    countedDates.push(dateKey);
                    const item = groupedDates[dateKey][index];
                    if(item.event_type == 'Entrada'){
                        entryHour = item.time;
                    } else if(item.event_type == 'Saida'){
                        endHour = item.time;
                    }
                }
            }
        })
        if(entryHour && endHour){
            totalHours = this.calculateHoursBetween(new Date(entryHour), new Date(endHour));
        }
        console.log('totalHours',totalHours);
        return Number(totalHours.toFixed(2));
    }
    

    private calculateHoursBetween(startTime: Date, endTime: Date): number {
        const timeDiff = Math.abs( endTime.getTime() - startTime.getTime());
        const hours = timeDiff / (1000 * 60 * 60);
        console.log('hours',hours)
        return hours;
    }
}