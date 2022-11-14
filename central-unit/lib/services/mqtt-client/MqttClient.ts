import * as mqtt from 'mqtt';

type MessageCB = (message: string) => void;
type Handler = {
    [k:string]: {
        cb: MessageCB,
        response_topic: string | undefined,
        mqtt_alternative: MqttClient | undefined
    }
};
export class MqttClient {
    private client: mqtt.Client;
    private callback: Handler = {};
    private ready: boolean = false;

    constructor(address: string, port: number) {
        console.log(`Connecting to mqtt://${address}`)
        this.client = mqtt.connect(`mqtt://${address}`);
        const $this = this;
        this.client.on("connect", function(err) {
            $this.ready = true;
        })
    }

    public async subscribe(topic: string, cb: MessageCB, response_topic?: string | undefined, mqtt_alternative?: MqttClient) {
        let tried = false;
        while(!this.ready) {
            await new Promise((res,rej) => setTimeout(res,200));
            if(tried)
                console.log(`Connection failed, retrying...`);
            tried = true;
        }
        this.client.subscribe(topic, (err) => {
            this.callback[topic] = {cb, response_topic, mqtt_alternative};
            if (err) console.error("Error: ", err);
            console.log(`Subscribe to topc ${topic}`);
        })
    }

    public publish(topic: string, message: string) {
        this.client.publish(topic, message, (err) => {
            if (err) {
                console.error(err)
            }
        })
    }

    public listen() {
        this.client.on("message", async (topic: string, payload: any) => {
            if(!this.callback[topic]) {
                console.log(`${topic} has not any callback registered`);
                return;
            }
            const handler = this.callback[topic];
            const response = await handler.cb(payload);
            if(handler.response_topic) 
                handler.mqtt_alternative ? 
                handler.mqtt_alternative.publish(handler.response_topic, JSON.stringify(response))
                : this.publish(handler.response_topic, JSON.stringify(response));
        })
    }
}