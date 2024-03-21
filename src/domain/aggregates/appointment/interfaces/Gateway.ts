import TimeSheetRecord from "../entities/TimeSheetRecord";

export default interface IGateway {
    createAppointment(
        registry_number:number, 
    ) : Promise<any>
    getRecordsByUserId(registry_number: number): Promise<TimeSheetRecord[]>;
}