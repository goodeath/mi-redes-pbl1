import { HttpServer } from './lib/services/http-server/HttpServer';
import { Hidrometer } from './lib/services/Hidrometer';
import { HidrometerController } from './lib/controllers/HidrometerController';

const { PORT, SERVER_HOST, SERVER_PORT } = process.env;

const hidrometer = new Hidrometer({
	host: SERVER_HOST != undefined ? SERVER_HOST : 'localhost',
	port: SERVER_PORT != undefined ? +SERVER_PORT : 9090
});

const controller = new HidrometerController(hidrometer);
const server = new HttpServer();

server.post('/configure-flow', controller.configure_flow);
server.put('/pause-flow', controller.pause_flow);
server.put('/resume-flow', controller.resume_flow);
server.get('/details', controller.details);
server.get('/health-check', () => {});
server.listen(PORT != undefined ? +PORT : 9092);
