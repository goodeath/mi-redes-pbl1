import { MqttClient } from './lib/services/mqtt-client/MqttClient';
import { HttpServer } from './lib/services/http-server/HttpServer';
import { ServerController } from './lib/controllers/ServerController';
import { TOPIC_BLOCK, TOPIC_FOG_MEAN, TOPIC_HISTORY, TOPIC_TOP_FIVE, TOPIC_HISTORY_REQUEST, TOPIC_TOP_FIVE_REQUEST  } from './lib/services/mqtt-client/Topics';


const address = "172.17.0.3";
const mqtt = new MqttClient(address, 1883);

type History = {
    total: number,
    quantity: number
}

class MeanHistory {
    private history: History[] = []
    private MAX_HISTORY_COUNT = 30;

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
        let history:History;
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
class CentralUnitMQTT {
    public history_consumption: any[];
    private top_five: any = [];
    public mqtt: MqttClient


    constructor(mqtt: MqttClient){
        this.mqtt = mqtt;
    }

    public calculate_top(data: any[]): void {
        let top:any[] = this.top_five.concat(data);
        top = top.sort( (a,b) => a.total - b.total);
        this.top_five = top.slice(0,5);
    }

    public refresh_history(id: number) {
        this.mqtt.publish(TOPIC_HISTORY_REQUEST, id.toString());
    }

    public refresh_topfive(id: number) {
        this.mqtt.publish(TOPIC_TOP_FIVE_REQUEST, id.toString());
    }
}

const central_unit = new CentralUnitMQTT(mqtt);

// Calculate Mean
mqtt.subscribe(TOPIC_FOG_MEAN, (message: string) => {
    const data = message.toString();
    const json = JSON.parse(data);
    mean_history.add(json);
    mqtt.publish(TOPIC_BLOCK, mean_history.get_mean().toString())
});

// Top Consumers
mqtt.subscribe(TOPIC_TOP_FIVE, (message: string) => {
    message = JSON.parse(message);
    central_unit.calculate_top(message as any);
})
// Check History
mqtt.subscribe(TOPIC_HISTORY, (message: string) => {
    central_unit.history_consumption = JSON.parse(message);
})

const controller = new ServerController(central_unit);
const server = new HttpServer();

server.get('/hidrometer/history', controller.history);
server.get('/hidrometer/top_five', controller.top_five);

server.listen(9092);