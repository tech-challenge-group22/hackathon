export default interface IAwsMySqlGateway{
    getEmployeeByRegistry(
        registry_number:number, 
    ) : Promise<any>
}