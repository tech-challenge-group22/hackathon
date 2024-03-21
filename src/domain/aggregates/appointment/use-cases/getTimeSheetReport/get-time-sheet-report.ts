import IGateway from "../../interfaces/Gateway";
import IUseCase from "../../interfaces/UseCase";
import { DateItem, Dates, Report, getTimeSheetReportInput } from "./getTimeSheetReportDTO";

export default class GetTimeSheetReport implements IUseCase{
    input:getTimeSheetReportInput;
    gateway:IGateway;
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
    
    constructor(input: getTimeSheetReportInput, gateway: IGateway){
        this.gateway = gateway;
        this.input = input;
    }

    async execute(): Promise<any> {
        return await this.gateway.getAll();
        // const result = await this.gateway.getAll();
        // if(result){
        //     let dateItems:DateItem[] = [];
        //     result.forEach((element: any) => {
        //         dateItems.push(element);
        //     });
        //     const dates = this.groupByDate(dateItems);
        //     let output:Report;
        //     output.employe_registry_number = this.input.employe_registry_number;
        //     output.dates = dates;
        //     return output;
        // }
        // throw new Error("Method not implemented.");
    }

    private groupByDate(items: DateItem[]): Dates {
        const groupedDates: Dates = {};
        items.forEach(item => {
            const dateKey = item.time.toLocaleDateString()
            if (!groupedDates[dateKey]) {
                groupedDates[dateKey] = [];
            }
            groupedDates[dateKey].push(item);
        });
        return groupedDates;
    }

}