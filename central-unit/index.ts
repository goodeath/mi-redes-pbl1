/**
 * Central Unit
 */

 import { MqttClient } from './lib/services/mqtt-client/MqttClient';
 
 const address = "mqtt://localhost";
 const mqtt = new MqttClient(address, 1883);

type History = {
    total: number,
    quantity: number
}

class MeanHistory {
    private history: History[] = []
    private const MAX_HISTORY_COUNT = 30;

    public add(data: History){
        const last = this.history.length;
        const last_record = this.history[last-1];
        this.cut_history(this.MAX_HISTORY_COUNT);
        this.history.push(this.compute_mean(last_record, data));
    }

    public get_mean(): number {
        return this.history[this.history.length-1].total;
    }

    private compute_mean(current: History, next: History): History {
        const history:History;
        history.total = ((current.total*current.quantity) + (next.total*next.quantity)) / (current.quantity-next.quantity);
        history.quantity = current.quantity - next.quantity;
        return history;
    }

    private cut_history(limit: number): void {
        if(this.history.length < limit) return ;
        const first = this.history.shift();
        first.total = -first.total
        for(let i = 0; i < this.history.length; i++)
            this.history[i] = this.compute_mean(this.history[i], first);
    }
}

const mean_history = new MeanHistory();
//1+2+3 / 3 = 2

//5+7/ 2=  6


///6*2 + 2*3 / 5 = 3,
class CentralUnitMQTT {
    
}


 mqtt.subscribe('mean');
 mqtt.message(async (topic:any, message:any) => {
     // Process Mean
     if(topic == 'mean'){
         const data = message.toString();
         const json = JSON.parse(data);
         mean_history.add(json);
         
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
 