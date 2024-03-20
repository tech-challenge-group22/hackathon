import { UUID } from "crypto";
import IEntity from "../interfaces/Entity";

export default class TimeSheetRecord implements IEntity{
    time: Date;
    registry_number: number;
    id: UUID;

    constructor(time:Date, registry_number:number, id:UUID){
        this.time = time;
        this.registry_number = registry_number;
        this.id = id;
    }
}