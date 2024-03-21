import IGateway from "../../interfaces/Gateway";
import IUseCase from "../../interfaces/UseCase";
import { SaveRecordInputDTO, SaveRecordOutputDTO } from "./save-recordDTO";
import { UUID } from "crypto";
import { v4 as uuidv4 } from 'uuid';

export default class SaveRecord implements IUseCase{

    private readonly gateway: IGateway;

    constructor(
        gateway: IGateway,
    ) {
        this.gateway = gateway;
    }
    async execute(input: SaveRecordInputDTO): Promise<any> {

        try{
        const result = await this.gateway.createAppointment(
            input.registry_number,
            );          
            let output:SaveRecordOutputDTO = {
                hasError: false,
                message: 'Appointment inserted successfully',
                result: result,
            };

            return output;
        }
        catch (error: any) {
            const output: SaveRecordOutputDTO = {
                hasError: true,
                message: 'Failed to create appointment',
                array_errors: error,
            };
            return output;
        }
        
        

    }

}