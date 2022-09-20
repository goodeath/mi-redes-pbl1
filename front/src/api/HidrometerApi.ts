import Axios, { AxiosInstance } from 'axios';

export class HidrometerApi {
	private axios: AxiosInstance;

	constructor(){
		this.axios = Axios.create();
	}



	public getipaddr = async (id: number) => {
		const response = this.axios.get(`http://localhost:9092/hidrometer/ipaddr?registration_id=${id}`);
		return response;
	}

	
	public getDetails = async (id: number) => {
		const remote = await this.getipaddr(id);
		const ip = remote.data.ip;
		const response = this.axios.get(`http://${ip}/details`,  {headers:{'Content-Type':"text/plain"}});
		return response;
	}


	public configureFlow = async (id: number, flow:number) => {
		const remote = await this.getipaddr(id);
		const ip = remote.data.ip;
		const response = this.axios.post(`http://${ip}/configure-flow`,  {flow}, {headers:{'Content-Type':"text/plain"}});
		return response;
	}


	public pay = async (id: number) => {
		const response = this.axios.post(`http://localhost:9092/accounts/pay`, {registration_id:id}, {headers:{'Content-Type':"text/plain"}});
		return response;
	}
}
