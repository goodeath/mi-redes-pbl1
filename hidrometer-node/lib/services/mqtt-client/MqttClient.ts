import * as mqtt from 'mqtt';

export class MqttClient{
    private client: mqtt.Client
    
    constructor(){
        const broker = "mqtt://broker.emqx.io:1883"
        this.client = mqtt.connect(broker);
    }
    public subscribe(topic:string){
        this.client.on("connect",()=>{
            this.client.subscribe([topic],(err)=>{
                if(err){console.error("Error: ", err)}
                console.log(`Subscribe to topc ${topic}`)
            })
        })
    }
    public publish(topic:string,message:string){
        this.client.on("connect",()=>{
            this.client.publish(topic,message,(err)=>{
                if(err){
                    console.error(err)
                }
            })
        })
    }

    public message() {
        this.client.on("message",(topic:string,payload:Buffer)=>{
            console.log(payload.toString())
            // return payload.toString()  
        })
       
    }
}