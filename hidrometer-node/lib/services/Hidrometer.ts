import { MqttClient } from './mqtt-client/MqttClient';
import { UdpOptions } from './udp-client/UdpOptions';


export class Hidrometer {
	private id: string;
	private flow_rate: number = 0;
	private consumption: number = 0;
	private control_id: NodeJS.Timer | null = null;
	private sync_control_id: NodeJS.Timer | undefined;
	private options: UdpOptions | undefined;
	private mqtt:MqttClient;
	
	public get_id = ():string => this.id;
	public get_flow_rate = ():number => this.flow_rate;
	public get_consumption = ():number => this.consumption;
	
	constructor(options?: UdpOptions){
		this.mqtt = new MqttClient(process.env.BROKER_ADDRESS, process.env.BROKER_PORT);
		//this.mqtt = new MqttClient("broker.hivemq.com", "8003");
		this.options = options;
		const randomness = Math.floor(Math.random()*100000);
		this.id = String(Date.now()) + String(randomness);
		this.flow_rate = Math.floor(Math.random()*20);
		this.mqtt.subscribe(["stop","restart"])
		this.control_id = setInterval(this.flush_water, 1000);
		this.sync_control_id = setInterval(this.sync_data, 5500);
		this.block();

	}


	
	public sync_data = (): void => {
		if(!this.options) return;
		const message = Buffer.from(`${this.id}, ${this.consumption}, ${Date.now()}, ${process.env.PORT}`);
		this.mqtt.publish('data', message.toString());
		
	}

	public block = ():void=>{
		this.mqtt.message((topic:any,message:any)=>{
			const data = message.toString();
			if(topic=='stop'){
				if(data ==this.id){
					console.log("Pausando")
					this.pause_flow();
				}
			}else if(topic =="restart"){
				if(data == this.id){
					console.log("Retomando");
					console.log(data);
					this.consumption = 0;
					this.set_flow(1);
					this.resume_flow(); 
				}
			}
		})
	}

	public pause_flow = (): void => {
		if(this.control_id)
			clearInterval(this.control_id);
		if(this.sync_control_id)
			clearInterval(this.sync_control_id);
		
	}

	public resume_flow = (): void => {
		this.control_id = setInterval(this.flush_water, 1000);
		this.sync_control_id = setInterval(this.sync_data, 5500);
	}

	public set_flow = (flow_rate:number): void => {
		this.flow_rate = flow_rate;
	}

	private flush_water = (): void => {
		
		this.consumption += Math.ceil(this.flow_rate*Math.random());
	}

}
