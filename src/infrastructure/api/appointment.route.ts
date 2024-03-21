import HttpServer from "../../application/ports/HttpServer";
import { Request, Response } from 'express';
import AppointmentController from "../../domain/aggregates/appointment/controllers/AppointmentController";

import { SaveRecordOutputDTO } from '../../domain/aggregates/appointment/use-cases/saveRecord/save-recordDTO';

export default class AppointmentRoute{
    private readonly httpServer: HttpServer;
    constructor(httpServer: HttpServer) {
        this.httpServer = httpServer;
        this.routes();
    }

    async routes(){
     this.createAppointment();
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
}