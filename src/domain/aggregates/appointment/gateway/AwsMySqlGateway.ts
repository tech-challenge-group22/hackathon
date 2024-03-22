const util = require('util');
import mysql from 'mysql';
import IAwsMySqlGateway from '../interfaces/AwsRdsGateway';


export default class AwsMySqlGateway implements IAwsMySqlGateway  {
  
  private client: any;
  private connection: any;

  constructor() {
    this.client = mysql;

    this.connection = this.client.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    this.connection.connect();
  }

  async getEmployeeByRegistry(registry: number): Promise<any> {
    // const connection = this.startConnection();

    const queryPromise = util
      .promisify(this.connection.query)
      .bind(this.connection);
    try {
      //  await this.connection.connect();
      const query = 'SELECT * FROM employees where employee_registry = ? ';
      const queryParams = [registry];

      // Executar a consulta SQL

      const results = await queryPromise(query, queryParams);

      return results;
    } catch (err) {
      console.error('Erro to connect with the database:', err);
    } finally {
      this.closeConnection();
    }
  }

  closeConnection(): void {
    this.connection.end((err: { message: any; }) => {
      if (err) {
        console.error('Error closing MySQL connection:', err.message);
      } else {
        console.log('MySQL connection closed.');
      }
    });
  }

}