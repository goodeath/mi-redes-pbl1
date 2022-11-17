import { MqttClient } from './lib/services/mqtt-client/MqttClient';
import { HttpServer } from './lib/services/http-server/HttpServer';
import { ServerController } from './lib/controllers/ServerController';
import { TOPIC_BLOCK, TOPIC_FOG_MEAN, TOPIC_HISTORY, TOPIC_TOP_FIVE, TOPIC_HISTORY_REQUEST, TOPIC_FOG_MEAN_REQUEST, TOPIC_TOP_FIVE_REQUEST, TOPIC_BLOCK_REQUEST, TOPIC_CONFIGURE_REQUEST  } from './lib/services/mqtt-client/Topics';


let { MQTT_HOST } = process.env;

const address = MQTT_HOST || "172.17.0.3";
const mqtt = new MqttClient(address, 1883);

type History = {
    total: number,
    quantity: number,
    id: string
}

class MeanHistory {
    private history: Record<string,History> = {};

    public add(data: History){
        this.history[data.id] = data;
    }

    public get_mean(): number {
        let quantity =  0;
        let total = 0;
        Object.keys(this.history).forEach( (key:string) => {
            quantity += this.history[key].quantity;
            total += this.history[key].total*this.history[key].quantity;
        })
        if(!quantity) return 1e9;
        return total/quantity;
    }

}

const mean_history = new MeanHistory();
class CentralUnitMQTT {
    public history_consumption: any[] = [];
    private top_five: any = [];
    public mqtt: MqttClient


    constructor(mqtt: MqttClient){
        this.mqtt = mqtt;
    }

    public calculate_top(data: any[]): void {
        const ids = data.map( (d:any) => d.registration_id );
        let top:any[] = this.top_five.filter((f:any) => ids.indexOf(f.registration_id) == -1).concat(data);
        top = top.sort( (a,b) => b.total - a.total);
        this.top_five = top.slice(0,5);
    }

    public refresh_history(id: number) {
        this.mqtt.publish(TOPIC_HISTORY_REQUEST, id.toString());
    }

    public refresh_topfive(id: number) {
        this.mqtt.publish(TOPIC_TOP_FIVE_REQUEST, '');
    }

    public configure_hidrometer(data:any){
        this.mqtt.publish(TOPIC_CONFIGURE_REQUEST, data);
    }
}

const central_unit = new CentralUnitMQTT(mqtt);

// Calculate Mean
mqtt.subscribe(TOPIC_FOG_MEAN, (message: string) => {
    const data = message.toString();
    const json = JSON.parse(data);
    console.log(json);
    mean_history.add(json);
    mqtt.publish(TOPIC_BLOCK_REQUEST, mean_history.get_mean().toString())
});

// Top Consumers
mqtt.subscribe(TOPIC_TOP_FIVE, (message: string) => {
    let messag:any = JSON.parse(message.toString());
    central_unit.calculate_top(messag as any);
})
// Check History
mqtt.subscribe(TOPIC_HISTORY, (message: string) => {
    central_unit.history_consumption = JSON.parse(message);
})

mqtt.listen();

const controller = new ServerController(central_unit);
const server = new HttpServer();

server.get('/hidrometer/history', controller.history);
server.get('/hidrometer/top_five', controller.top_five);
server.post('/hidrometer/configure', controller.configure);

server.listen(11000);

setInterval(()=>{
    mqtt.publish(TOPIC_FOG_MEAN_REQUEST,'');
},2000);