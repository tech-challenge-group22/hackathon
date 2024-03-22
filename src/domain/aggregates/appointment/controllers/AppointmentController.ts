import AwsMySqlGateway from "../gateway/AwsMySqlGateway";
import DynamoGateway from "../gateway/DynamoGateway";
import IGateway from "../interfaces/Gateway";
import IUseCase from "../interfaces/UseCase";
import GetTimeSheetReport from "../use-cases/getTimeSheetReport/get-time-sheet-report";
import { getTimeSheetReportInput } from "../use-cases/getTimeSheetReport/getTimeSheetReportDTO";
import SaveRecord from "../use-cases/saveRecord/save-record";
import { SaveRecordInputDTO, SaveRecordOutputDTO } from "../use-cases/saveRecord/save-recordDTO";

import GetIntraDayRecord from "../use-cases/getIntraDayRecord/get-intra-day-record";
import { GetIntraDayRecordInputDTO, GetIntraDayRecordOutputDTO, QueryParamsDTO } from "../use-cases/getIntraDayRecord/get-intraday-recordsDTO";

export default class AppointmentController {
   
    static async createAppointment(body: string): Promise<any> {
        const createUseCase: SaveRecord = new SaveRecord(
          new DynamoGateway(),
          new AwsMySqlGateway()
        );
        const input: SaveRecordInputDTO =
          body as unknown as SaveRecordInputDTO;
        const output: SaveRecordOutputDTO = await createUseCase.execute(input);
        return output;
    }

    static async generateMonthReport(employeNumber: number){
      const input: getTimeSheetReportInput = {
        employe_registry_number: employeNumber
      };
      const gateway: IGateway = new DynamoGateway();
      const useCase: IUseCase = new GetTimeSheetReport(input, gateway);
      const output: any = await useCase.execute();
      return output;
    }

    static async getIntraDayRecord(registry_number: number): Promise<any> {
      const input: GetIntraDayRecordInputDTO = {
        registry_number: registry_number
      }

      const gateway: IGateway = new DynamoGateway();
      const useCase: IUseCase = new GetIntraDayRecord(input, gateway);
      const output: any = await useCase.execute(input);
      return output;
  }

}