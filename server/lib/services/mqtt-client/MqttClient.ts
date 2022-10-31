import * as mqtt from 'mqtt';

export class MqttClient {
    private client_server: mqtt.Client
    private ready: boolean = false;
    private data: string = ''
    constructor(address:string, port:number){
        this.client_server = mqtt.connect(address);
        const $this = this;
        this.client_server.on("connect", function(err) {
            $this.ready = true;
        })
    }

    public subscribe(topic:string[]){
        this.client_server.subscribe(topic,(err)=>{
            if(err) console.error("Error: ",err)
            console.log("Subscribe to topic ", topic)
        });
    }

    public publish(topic:string, message:string){
        this.client_server.publish(topic,message,(err)=>{
            if(err){
                console.error(err);
            }
        })
    }

    public message(){
       
        this.client_server.on("message",(topic:string,payload:Buffer)=>{
           
            this.data = payload.toString()
            // console.log(this.data);
        })
        return this.data 
    }
}