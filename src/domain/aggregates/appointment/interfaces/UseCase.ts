import IGateway from "./Gateway";

export default interface IUseCase{
    execute(input?: any, gateway?: IGateway): Promise<any>;
}