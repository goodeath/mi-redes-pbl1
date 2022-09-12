import { SocketUdp } from './lib/services/socket/SocketUdp';
import { BillRepository, BillHistoryRepository } from './lib/repositories/';
import { Bill } from './lib/models/Bill';

import './config-db.ts';

const socket = new SocketUdp();
socket.listen(9091, async (data: string) => {
    const bill_repository = new BillRepository();
    const bill_history_repository = new BillHistoryRepository();
    const [register_id, consumption, date] = data.split(',').map( (d:string) => d.trim());
    let current: Bill | undefined = await bill_repository.find_current(register_id);
    if(!current) current = await bill_repository.open(register_id);
    await bill_history_repository.insert(register_id, +consumption);
});


// Configure http server
import { HttpServer } from './lib/services/http-server/HttpServer';
import { ServerController } from './lib/controllers/ServerController';

const controller = new ServerController();
const server = new HttpServer();

server.get('/accounts/history', controller.history);
server.get('/accounts/list', controller.list);
server.listen(9092);
