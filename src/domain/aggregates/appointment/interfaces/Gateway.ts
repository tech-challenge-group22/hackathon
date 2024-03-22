export default interface IGateway{
    createAppointment(
        registry_number:number, 
        event_type: number
    ) : Promise<any>
    getAll():Promise<any>;
}