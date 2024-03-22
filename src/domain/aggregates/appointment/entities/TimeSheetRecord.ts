import { UUID } from "crypto";
import IEntity from "../interfaces/Entity";

export default class TimeSheetRecord implements IEntity{
    time: Date;
    registry_number: number;
    id: UUID;
    event_type: EventType

    constructor(time:Date, registry_number:number, id:UUID , event_type : EventType){
        this.time = time;
        this.registry_number = registry_number;
        this.id = id;
        this.event_type = event_type
    }
}

export enum EventType {
    Entrada = 1,
    Intervalo = 2,
    Saida = 3,
  }
  