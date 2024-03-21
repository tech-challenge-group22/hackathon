import { Request, Response } from "express";
import HttpServer from "../../application/ports/HttpServer";
import GetIntraDayRecord from "../../domain/aggregates/appointment/use-cases/getIntraDayRecord/GetIntraDayRecord";
import MockGateway from '../../domain/aggregates/appointment/gateway/MockGateway';

export default class AppointmentRoute{
    private readonly httpServer: HttpServer;

    constructor(httpServer: HttpServer) {
        this.httpServer = httpServer;
        this.routes();
    }

    async routes(){
        this.getIntraDayRecords();
    }

    getIntraDayRecords() {
        this.httpServer.register(
            'get',
            '/appointments',
            async (req: Request, resp: Response) => {
                const registry_number = req.query.registry_number;
                const output: GetIntraDayRecordOutputDTO = await AppointmentController.getIntraDayRecord(registry_number);
                if (output.hasError) {
                    return resp.status(400).json(output);
                } else {
                    return resp.status(200).json(output.result);
                }
            }
        )
    }
    // async routes(){
    //     this.httpServer.register('get', '/get_intraday_appointments/:registry_number', async (req: Request, resp: Response) => {
    //         try {
    //             const registry_number = req.params.registry_number;
    //             const records = await this.getIntraDayRecordUseCase.execute(registry_number);
    //             resp.json(records);
    //         } catch (error) {
    //             if (error instanceof Error) {
    //                 resp.status(500).json({ error: error.message });
    //               } else {
    //                 resp.status(500).json({ error: 'Ocorreu um erro desconhecido' });
    //               }
    //         }
    //     });
    // }
}