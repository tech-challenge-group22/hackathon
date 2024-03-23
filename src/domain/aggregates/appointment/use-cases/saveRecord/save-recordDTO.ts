import { UUID } from "crypto";
export interface SaveRecordInputDTO {
    time:Date, 
    registry_number:number, 
    id: UUID
    event_type: number
  }
  
  export interface SaveRecordOutputDTO {
    hasError: boolean;
    message?: string;
    result?: SaveRecordInputDTO[];
    array_errors?: string[];
  }
  