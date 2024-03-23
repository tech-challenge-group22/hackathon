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
    this.getIntraDayRecords();
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
      '/report',
      async (req: Request, res: Response) => {
        try {
          if (req.query.employe_registry_number && req.query.employe_email) {
            const registry = Number(req.query.employe_registry_number);
            validatePermission(req, res, registry);
            const output = await AppointmentController.generateMonthReport(
              registry,
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

  getIntraDayRecords() {
    this.httpServer.register(
        'get',
        '/appointments/:registry_number',
        async (req: Request, resp: Response) => {
            const registry_number = Number(req.params.registry_number);
            validatePermission(req, resp, registry_number);
            const output = await AppointmentController.getIntraDayRecord(registry_number);
            if (output.hasError) {
                return resp.status(400).json(output);
            } else {
                return resp.status(200).json(output);
            }
        }
        )
    }

}
