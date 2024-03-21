import { UUID } from "crypto";
export default interface IGateway{
    createAppointment(
        registry_number:number, 
    ) : Promise<any>
    getLastMonthReport(registry_number: number): Promise<any>;
}