import HttpServer from '../../application/ports/HttpServer';
import { Request, Response } from 'express';
import AppointmentController from '../../domain/aggregates/appointment/controllers/AppointmentController';

import { SaveRecordOutputDTO } from '../../domain/aggregates/appointment/use-cases/saveRecord/save-recordDTO';
import GetTimeSheetReport from '../../domain/aggregates/appointment/use-cases/getTimeSheetReport/get-time-sheet-report';
import { getTimeSheetReportInput } from '../../domain/aggregates/appointment/use-cases/getTimeSheetReport/getTimeSheetReportDTO';
import IGateway from '../../domain/aggregates/appointment/interfaces/Gateway';
import DynamoGateway from '../../domain/aggregates/appointment/gateway/DynamoGateway';
import IUseCase from '../../domain/aggregates/appointment/interfaces/UseCase';

export default class AppointmentRoute {
  private readonly httpServer: HttpServer;
  constructor(httpServer: HttpServer) {
    this.httpServer = httpServer;
    this.routes();
  }

  async routes() {
    this.createAppointment();
    this.getReport();
  }

  createAppointment() {
    this.httpServer.register(
      'post',
      '/appointments',
      async (req: Request, resp: Response) => {
        try {
          const output: SaveRecordOutputDTO =
            await AppointmentController.createAppointment(req.body);
          return resp.status(200).json(output);
        } catch (error) {
          return resp.status(400).json({ Error: error });
        }
      },
    );
  }

  getReport() {
    this.httpServer.register(
      'get',
      '/report',
      async (req: Request, res: Response) => {
        try {
          if (req.query.employe_registry_number && req.query.employe_email) {
            const output = await AppointmentController.generateMonthReport(
              Number(req.query.employe_registry_number),
              String(req.query.employe_email),
            );
            return res.status(200).json(output);
          } else {
            return res
              .status(200)
              .json({ Error: 'Missing employe registry number' });
          }
        } catch (error) {
          console.log('ERROR:', error);
          return res.status(500).json(error);
        }
      },
    );
  }
}
