export interface DateItem {
    time_sheet_id: number;
    time: Date;
    event_type: string;
}

export interface Dates {
    [date: string]: DateItem[];
}

export interface Report {
    employe_registry_number: number;
    dates: Dates;
    work_hours: number;
}

export interface getTimeSheetReportInput{
    employe_registry_number:number;
    employe_email: string;
}