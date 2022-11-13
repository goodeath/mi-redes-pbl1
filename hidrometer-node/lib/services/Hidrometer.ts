import { MqttClient } from './mqtt-client/MqttClient';
import { TOPIC_SEND_DETAILS } from './mqtt-client/Topics';
const ip = require('ip');
export class Hidrometer {
	private id: string;
	private flow_rate: number = 0;
	private consumption: number = 0;
	private control_id: NodeJS.Timer | null = null;
	private sync_control_id: NodeJS.Timer | undefined;
	
	private mqtt:MqttClient;
	
	public get_id = ():string => this.id;
	public get_flow_rate = ():number => this.flow_rate;
	public get_consumption = ():number => this.consumption;
	
	constructor(mqtt?: MqttClient){
		this.mqtt = mqtt;
		
		const randomness = Math.floor(Math.random()*100000);
		this.id = String(Date.now()) + String(randomness);
		this.flow_rate = Math.floor(Math.random()*20);
		this.control_id = setInterval(this.flush_water, 1000);
		this.sync_control_id = setInterval(this.sync_data, 5500);
	}


	public sync_data = (): void => {
		if(!this.mqtt) return;
		const address = ip.address();
		const message = Buffer.from(`${this.id}, ${this.consumption}, ${Date.now()}, ${process.env.PORT}, ${address}`);
		this.mqtt.publish(TOPIC_SEND_DETAILS, message.toString());
	}

	public pause_flow = (): void => {
		if(this.control_id)
			clearInterval(this.control_id);
		if(this.sync_control_id)
			clearInterval(this.sync_control_id);
	}

	public resume_flow = (): void => {
		this.control_id = setInterval(this.flush_water, 1000);
		this.sync_control_id = setInterval(this.sync_data, 1000);
	}

	public set_flow = (flow_rate:number): void => {
		this.flow_rate = flow_rate;
	}

	private flush_water = (): void => {
		this.consumption += Math.ceil(this.flow_rate*Math.random());
	}

}
