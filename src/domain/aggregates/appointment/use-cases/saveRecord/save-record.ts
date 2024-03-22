import { EventType } from "../../entities/TimeSheetRecord";
import IAwsMySqlGateway from "../../interfaces/AwsRdsGateway";
import IGateway from "../../interfaces/Gateway";
import IUseCase from "../../interfaces/UseCase";
import { SaveRecordInputDTO, SaveRecordOutputDTO } from "./save-recordDTO";

export default class SaveRecord implements IUseCase{

    private readonly gateway: IGateway;
    private readonly rdsgateway : IAwsMySqlGateway

    constructor(
        gateway: IGateway,
        rdsgateway : IAwsMySqlGateway
    ) {
        this.gateway = gateway;
        this.rdsgateway = rdsgateway;
    }
    async execute(input: SaveRecordInputDTO): Promise<any> {

        try{
           const hasemployee = await this.checkEmployee(input.registry_number)
            if(hasemployee.length > 0){

                if(input.event_type !== EventType.Entrada && input.event_type !== EventType.Intervalo && input.event_type !== EventType.Saida)
                {
                    let output:SaveRecordOutputDTO = {
                        hasError: false,
                        message: 'Invalid event type',
                        result: [],
                    };

                    return output;
                }
                const result = await this.gateway.createAppointment(
                    input.registry_number,
                    input.event_type
                    );          
                    let output:SaveRecordOutputDTO = {
                        hasError: false,
                        message: 'Appointment inserted successfully',
                        result: result,
                    };
    
                return output;

            }else{
                let output:SaveRecordOutputDTO = {
                    hasError: false,
                    message: 'Invalid employee',
                    result: [],
                };

                return output
            }
            
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
     async checkEmployee(registry : number){
       let result : any = await this.rdsgateway.getEmployeeByRegistry(registry)
       return result
    }

}