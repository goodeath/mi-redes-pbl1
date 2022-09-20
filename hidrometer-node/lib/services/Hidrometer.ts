import { UdpClient } from './udp-client/UdpClient';
import { UdpOptions } from './udp-client/UdpOptions';

export class Hidrometer {
	private id: string;
	private flow_rate: number = 0;
	private consumption: number = 0;
	private control_id: NodeJS.Timer | null = null;
	private sync_control_id: NodeJS.Timer | undefined;
	private options: UdpOptions | undefined;

	public get_id = ():string => this.id;
	public get_flow_rate = ():number => this.flow_rate;
	public get_consumption = ():number => this.consumption;

	constructor(options?: UdpOptions){
		this.options = options;
		const randomness = Math.floor(Math.random()*100000);
		this.id = String(Date.now()) + String(randomness);
		this.flow_rate = Math.floor(Math.random()*20);
		this.control_id = setInterval(this.flush_water, 1000);
		this.sync_control_id = setInterval(this.sync_data, 5500);
	}


	public sync_data = (): void => {
		if(!this.options) return;
		const message = Buffer.from(`${this.id}, ${this.consumption}, ${Date.now()}, ${process.env.PORT}`);
		const udp = new UdpClient();
		udp.send(message, this.options, (error: Error) => {
			if(error) console.log('Error in sync data:', error);
			this.consumption = 0;
		});
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
