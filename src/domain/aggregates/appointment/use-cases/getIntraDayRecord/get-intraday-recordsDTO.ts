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

export interface QueryParamsDTO {
    paramId: number;
}