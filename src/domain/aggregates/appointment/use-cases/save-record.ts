import IGateway from "../interfaces/Gateway";
import IUseCase from "../interfaces/UseCase";

export default class SaveRecord implements IUseCase{
    execute(input: any, gateway: IGateway): Promise<any> {
        throw new Error("Method not implemented.");
    }

}