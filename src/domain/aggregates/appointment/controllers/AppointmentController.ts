import DynamoGateway from "../gateway/DynamoGateway";
import SaveRecord from "../use-cases/saveRecord/save-record";
import { SaveRecordInputDTO, SaveRecordOutputDTO } from "../use-cases/saveRecord/save-recordDTO";

export default class AppointmentController {
   
    static async createAppointment(body: string): Promise<any> {
        const createUseCase: SaveRecord = new SaveRecord(
          new DynamoGateway(),
        );
        const input: SaveRecordInputDTO =
          body as unknown as SaveRecordInputDTO;
        const output: SaveRecordOutputDTO = await createUseCase.execute(input);
        return output;
    }

}