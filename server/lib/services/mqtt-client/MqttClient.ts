import * as mqtt from 'mqtt';

export class MqttClient {
    private client: mqtt.Client
    private ready: boolean = false;
    private data: string = ''
    constructor(address:string, port:number){
        this.client = mqtt.connect(address);
        const $this = this;
        this.client.on("connect", function(err) {
            $this.ready = true;
        })
    }

    public subscribe(topic:string){
        this.client.subscribe(topic,(err)=>{
            if(err) console.error("Error: ",err)
            console.log("Subscribe to topic ", topic)
        });
    }

    public publish(topic:string, message:string){
        this.client.publish(topic,message,(err)=>{
            if(err){
                console.error(err);
            }
        })
    }

    public message(cb: Function){
        this.client.on("message",(topic:string,payload:Buffer)=>{
            cb(topic, payload);
        })
        return this.data 
    }
}