import { DynamoDB } from "@aws-sdk/client-dynamodb";
import IGateway from "../interfaces/Gateway";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

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
}