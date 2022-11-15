const ip = require('ip');
export class Hidrometer {
	private id: string;
	private flow_rate: number = 0;
	private consumption: number = 0;
	private control_id: NodeJS.Timer | null = null;
	private sync_control_id: NodeJS.Timer | undefined;
	

	private sync_data_handle: Function | undefined;
	
	public get_id = ():string => this.id;
	public get_flow_rate = ():number => this.flow_rate;
	public get_consumption = ():number => this.consumption;
	
	constructor(){
		
		const randomness = Math.floor(Math.random()*100000);
		this.id = String(Date.now()) + String(randomness);
		this.flow_rate = Math.floor(Math.random()*20);
		this.control_id = setInterval(this.flush_water, 1000);
		this.sync_control_id = setInterval(this.sync_data, 5500);
	}

	public set_sync_data_handle(cb: Function) {
		this.sync_data_handle = cb;
	}


	public sync_data = (): void => {
		const address = ip.address();
		const message = Buffer.from(`${this.id}, ${this.consumption}, ${Date.now()}, ${process.env.PORT}, ${address}`);
		if(this.sync_data_handle) {
			this.sync_data_handle(message);
			this.consumption = 0;
		}
	}

	public pause_flow = (): void => {

		if(this.control_id){
			clearInterval(this.control_id[Symbol.toPrimitive]());
			this.control_id = null;
		}
		if(this.sync_control_id) {
			clearInterval(this.sync_control_id[Symbol.toPrimitive]());
			this.sync_control_id = undefined;
		}
	}

	public resume_flow = (): void => {
		if(!this.control_id)
			this.control_id = setInterval(this.flush_water, 1000);
		if(!this.sync_control_id)
			this.sync_control_id = setInterval(this.sync_data, 1000);
	}

	public set_flow = (flow_rate:number): void => {
		this.flow_rate = flow_rate;
	}

	private flush_water = (): void => {
		this.consumption += Math.ceil(this.flow_rate*Math.random());
	}

}
