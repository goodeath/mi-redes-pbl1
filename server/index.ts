import * as udp from 'dgram';
import { SocketUdp } from './lib/services/socket/SocketUdp';
import { BillRepository, BillHistoryRepository, HidrometerNetinfoRepository } from './lib/repositories/';
import { Bill } from './lib/models/Bill';

import './config-db.ts';

const socket = new SocketUdp();
socket.listen(9091, async (data: string, rinfo: udp.RemoteInfo ) => {
    const netinfo = new HidrometerNetinfoRepository();
    const bill_repository = new BillRepository();
    const bill_history_repository = new BillHistoryRepository();
    const [register_id, consumption, date, port] = data.split(',').map( (d:string) => d.trim());


    await netinfo.create_or_update(register_id, rinfo.address+":"+port);
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
server.get('/hidrometer/ipaddr', controller.getIpAddr);
server.get('/accounts/list', controller.list);
server.post('/accounts/close', controller.close);
server.post('/accounts/pay', controller.pay);

server.listen(9092);
