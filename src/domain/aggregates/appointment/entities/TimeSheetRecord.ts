import { UUID } from "crypto";
import IEntity from "../interfaces/Entity";


export enum RecordType {
    Entrada = "entrada",
    IntervaloInicio = "intevalo-inicio",
    IntervaloFim = "intervalo-fim",
    Saida = "saida"
}

export default class TimeSheetRecord implements IEntity{
    time: Date;
    registry_number: number; // Identificador do usuário para quem o registro pertence
    id: UUID;
    recordType: RecordType;

    constructor(time:Date, registry_number:number, id:UUID, recordType: RecordType){
        this.time = time;
        this.registry_number = registry_number;
        this.id = id;
        this.recordType = recordType;
    }
}