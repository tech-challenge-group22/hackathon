import { DateItem } from "../getTimeSheetReport/getTimeSheetReportDTO";

export interface GetIntraDayRecordInputDTO {
    registry_number: number;
}

export interface Dates {
    [date: string]: DateItem[];
}

export interface GetIntraDayRecordOutputDTO {
    //hasError: boolean;
    //message?: string;
    registry_number: number;
    marks: Dates;
}

export interface GetIntradayReportOutputDTO {
    registry_number: number;
    marks: Dates;
    work_hours: number;
}

export enum EventType {
    Entrada = 1,
    Intervalo = 2,
    Saida = 3,
  }

export const eventTypeString = new Map();
eventTypeString.set(1,"Entrada");
eventTypeString.set(2,"Intervalo");
eventTypeString.set(3,"Saida");