import HttpServer from "../../application/ports/HttpServer";

export default class AppointmentRoute{
    private readonly httpServer: HttpServer;
    constructor(httpServer: HttpServer) {
        this.httpServer = httpServer;
        this.routes();
    }

    async routes(){

    }
}