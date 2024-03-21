import DynamoGateway from "../gateway/DynamoGateway";
import GetIntraDayRecord from "../use-cases/getIntraDayRecord/GetIntraDayRecord";
import SaveRecord from "../use-cases/saveRecord/save-record";
import { SaveRecordInputDTO, SaveRecordOutputDTO } from "../use-cases/saveRecord/save-recordDTO";
import { GetIntraDayRecordOutputDTO, GetIntraDayRecordInputDTO } from "../use-cases/getIntraDayRecord/GetIntraDayRecordDTO";

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

    static async getIntraDayRecord(registry_number: number): Promise<any> {
        const getIntraDayRecordUseCase: GetIntraDayRecord = new GetIntraDayRecord(new DynamoGateway());

        const output: GetIntraDayRecordOutputDTO = await this.getIntraDayRecord.execute(registry_number);
        return output;
    }

}