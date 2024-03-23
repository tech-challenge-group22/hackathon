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
            let output: GetIntraDayRecordOutputDTO = {
                registry_number: this.input.registry_number,
                marks: marks
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
}