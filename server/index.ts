import { MqttClient } from './lib/services/mqtt-client/MqttClient';
import { BillRepository, BillHistoryRepository, HidrometerNetinfoRepository } from './lib/repositories/';
import { Bill } from './lib/models/Bill';

import './config-db.ts';

const address = "mqtt://localhost";
const mqtt = new MqttClient(address, 1883);
mqtt.subscribe('data');
mqtt.message(async (topic:any, message:any) => {
    if(topic == 'data'){
        const data = message.toString();
        const netinfo = new HidrometerNetinfoRepository();
        const bill_repository = new BillRepository();
        const bill_history_repository = new BillHistoryRepository();
        const [register_id, consumption, date, port, address] = data.split(',').map( (d:string) => d.trim());


        // simula bloqueio consumo
        if(consumption>100){
            mqtt.publish("stop", register_id)

            //simula liberação espera 8 segunos
            setTimeout(()=>{
                mqtt.publish("restart",register_id)
            },8000)
        }

       

        await netinfo.create_or_update(register_id, address+":"+port);
        let current: Bill | undefined = await bill_repository.find_current(register_id);
        if(!current) current = await bill_repository.open(register_id);
        await bill_history_repository.insert(register_id, +consumption);
        console.log(message.toString());
    }
})


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
