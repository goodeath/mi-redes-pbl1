export class Hidrometer {
	private id: string;
	private flow_rate: number = 0;
	private consumption: number = 0;
	private control_id: NodeJS.Timer = null;

	public get_id = ():string => this.id;
	public get_flow_rate = ():number => this.flow_rate;
	public get_consumption = ():number => this.consumption;

	constructor(){
		const randomness = Math.floor(Math.random()*100000);
		this.id = String(Date.now()) + String(randomness);
		this.flow_rate = Math.floor(Math.random()*20);
		this.control_id = setInterval(this.flush_water, 1000);
	}

	public pause_flow = (): void => {
		clearInterval(this.control_id);
	}

	public resume_flow = (): void => {
		this.control_id = setInterval(this.flush_water, 1000);
	}

	private flush_water = (): void => {
		this.consumption += this.flow_rate;
	}

}
