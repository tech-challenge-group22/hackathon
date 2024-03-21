import { DynamoDB } from "@aws-sdk/client-dynamodb";
import IGateway from "../interfaces/Gateway";
import { DynamoDBDocument ,  PutCommand} from "@aws-sdk/lib-dynamodb";
import { UUID } from "crypto";
import { v4 as uuidv4 } from 'uuid';
import TimeSheetRecord, { RecordType } from "../entities/TimeSheetRecord";

export default class DynamoGateway implements IGateway{

    private dynamodb: DynamoDBDocument;
    private table = 'records';
    
    constructor() {
      this.dynamodb = DynamoDBDocument.from(
        new DynamoDB({
          credentials: {
            accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
            secretAccessKey: `${process.env.AWS_SECRET}`,
            sessionToken: `${process.env.AWS_SESSION_TOKEN}`,
          },
          region: `${process.env.AWS_REGION}`,
        }),
      );
    }

    async createAppointment (
      registry_number:number
    ): Promise<any> {
      const chaveAleatoria: UUID = uuidv4() as UUID;

      let record : TimeSheetRecord = new TimeSheetRecord(
        new Date(), 
        registry_number, 
        chaveAleatoria,
        RecordType.Entrada
      );

      let input = {
        time : new Date(),
        registry_number : registry_number,
        id: chaveAleatoria
      };
      const params = {
        TableName: this.table,
        Item: input,
      };
      const response = await this.dynamodb.send(new PutCommand(params));
      return response;
    }

    async getRecordsByUserId(registry_number: number): Promise<TimeSheetRecord[]> {
      // Mock de dados de exemplo
      const chaveAleatoria: UUID = uuidv4() as UUID;
      const mockedData: TimeSheetRecord[] = [
          new TimeSheetRecord(new Date(), 1, chaveAleatoria, RecordType.Entrada),
          new TimeSheetRecord(new Date(), 2, chaveAleatoria, RecordType.Saida)
      ];
      return Promise.resolve(mockedData);
  }
}