import * as mqtt from 'mqtt';

type MessageCB = (message: string) => void;
export class MqttClient {
    private client: mqtt.Client;
    private callback: Record<string, Function>[] = [];
    private ready: boolean = false;

    constructor(address: string, port: number) {
        this.client = mqtt.connect(`mqtt://${address}`);
        const $this = this;
        this.client.on("connect", function(err) {
            $this.ready = true;
        })
    }

    public subscribe(topic: string, cb: MessageCB) {
        this.client.subscribe(topic, (err) => {
            this.callback.push({[topic]: cb});
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
        this.client.on("message", (topic: string, payload: any) => {
            if(this.callback[topic]) this.callback[topic](payload);
            else console.log(`${topic} has not any callback registered`);
        })
    }
}