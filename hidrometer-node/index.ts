import { HttpServer } from './lib/services/http-server/HttpServer';
import { Hidrometer } from './lib/services/Hidrometer';
import { HidrometerController } from './lib/controllers/HidrometerController';

const hidrometer = new Hidrometer();
const controller = new HidrometerController(hidrometer);
const server = new HttpServer();

server.post('/configure-flow', (req:any,res:any) => {console.log(req.body)});
server.put('/pause-flow', controller.pause_flow);
server.put('/resume-flow', controller.resume_flow);
server.get('/details', controller.details);
server.get('/health-check', () => {});
server.listen(8080);
