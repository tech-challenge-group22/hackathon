import TimeSheetRecord from "../entities/TimeSheetRecord";
import IGateway from "../interfaces/Gateway";
import IUseCase from "../interfaces/UseCase";

export default class GetTimeSheetReport implements IUseCase{
    execute(input: TimeSheetRecord, gateway: IGateway): Promise<any> {
        throw new Error("Method not implemented.");
    }

}