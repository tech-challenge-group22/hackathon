import TimeSheetRecord, { RecordType } from "../entities/TimeSheetRecord";
import IGateway from "../interfaces/Gateway";
import { v4 as uuidv4 } from 'uuid';
import { UUID } from "crypto";

export default class MockGateway implements IGateway {
    getRecordsByUserId(registry_number: number): Promise<TimeSheetRecord[]> {
        // Mock de dados de exemplo
        const chaveAleatoria: UUID = uuidv4() as UUID;
        const mockedData: TimeSheetRecord[] = [
            new TimeSheetRecord(new Date(), 1, chaveAleatoria, RecordType.Entrada),
            new TimeSheetRecord(new Date(), 2, chaveAleatoria, RecordType.Saida)
        ];
        return Promise.resolve(mockedData);
    }
}

