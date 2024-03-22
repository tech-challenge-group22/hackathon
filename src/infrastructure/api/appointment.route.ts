import HttpServer from '../../application/ports/HttpServer';
import { Request, Response } from 'express';
import AppointmentController from '../../domain/aggregates/appointment/controllers/AppointmentController';

import { SaveRecordInputDTO, SaveRecordOutputDTO } from '../../domain/aggregates/appointment/use-cases/saveRecord/save-recordDTO';
import { validatePermission } from '../../application/adapters/middlewares/verifyToken';

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
          const input: SaveRecordInputDTO = req.body as unknown as SaveRecordInputDTO;
          validatePermission(req, resp, input.registry_number);
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
      '/report/:employe_registry_number',
      async (req: Request, res: Response) => {
        try {
          if (req.params.employe_registry_number) {
            validatePermission(req, res, Number(req.params.employe_registry_number));
            console.log('VALID');
            const output = await AppointmentController.generateMonthReport(Number(req.params.employe_registry_number));
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
