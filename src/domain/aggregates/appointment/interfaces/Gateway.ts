export default interface IGateway{
    createAppointment(
        registry_number:number, 
    ) : Promise<any>
    getLastMonthReport(registry_number: number): Promise<any>;
    getIntradayRecordsByRegistryNumber(registry_number: number): Promise<any>;
}