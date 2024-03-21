import { UUID } from "crypto";
export interface SaveRecordInputDTO {
    time:Date, 
    registry_number:number, 
    id: UUID
  }
  
  export interface SaveRecordOutputDTO {
    hasError: boolean;
    message?: string;
    result?: SaveRecordInputDTO[];
    array_errors?: string[];
  }
  