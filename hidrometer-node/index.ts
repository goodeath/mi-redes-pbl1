import { HttpServer } from './lib/services/http-server/HttpServer';
import { Hidrometer } from './lib/services/Hidrometer';
import { HidrometerController } from './lib/controllers/HidrometerController';

const hidrometer = new Hidrometer({
	host: 'localhost',
	port: 9091
});
const controller = new HidrometerController(hidrometer);
const server = new HttpServer();

server.post('/configure-flow', controller.configure_flow);
server.put('/pause-flow', controller.pause_flow);
server.put('/resume-flow', controller.resume_flow);
server.get('/details', controller.details);
server.get('/health-check', () => {});
server.listen(9090);
