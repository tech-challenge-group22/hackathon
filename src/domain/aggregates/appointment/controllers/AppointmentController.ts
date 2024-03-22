import AwsMySqlGateway from "../gateway/AwsMySqlGateway";
import DynamoGateway from "../gateway/DynamoGateway";
import IGateway from "../interfaces/Gateway";
import IUseCase from "../interfaces/UseCase";
import GetTimeSheetReport from "../use-cases/getTimeSheetReport/get-time-sheet-report";
import { getTimeSheetReportInput } from "../use-cases/getTimeSheetReport/getTimeSheetReportDTO";
import SaveRecord from "../use-cases/saveRecord/save-record";
import { SaveRecordInputDTO, SaveRecordOutputDTO } from "../use-cases/saveRecord/save-recordDTO";
import NodemailerAdapter from '../../../../application/adapters/NodemailerAdapter';

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

    static async generateMonthReport(employeNumber: number, employeEmail: string){
      const input: getTimeSheetReportInput = {
        employe_registry_number: employeNumber,
        employe_email: employeEmail
      };
      const gateway: IGateway = new DynamoGateway();
      const mailer: NodemailerAdapter = new NodemailerAdapter();
      const useCase: IUseCase = new GetTimeSheetReport(input, gateway, mailer);
      const output: any = await useCase.execute();
      return output;
    }

}