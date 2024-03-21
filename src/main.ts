import ExpressAdapter from './application/adapters/ExpressAdapter';
import * as dotenv from 'dotenv';
import AppointmentRoute from './infrastructure/api/appointment.route';

dotenv.config();
const server = new ExpressAdapter();

const appointmentRoute = new AppointmentRoute(server);

server.router(AppointmentRoute);

server.listen(3000);