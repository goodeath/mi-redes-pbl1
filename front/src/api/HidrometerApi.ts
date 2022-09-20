import Axios, { AxiosInstance } from 'axios';
import { CONFIG } from '../config';

export class HidrometerApi {
	private axios: AxiosInstance;
	private 

	constructor(){
		this.axios = Axios.create();
	}



	public getipaddr = async (id: number) => {
		const response = this.axios.get(`http://${CONFIG.HOST}:${CONFIG.PORT}/hidrometer/ipaddr?registration_id=${id}`);
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
		const response = this.axios.post(`http://${CONFIG.HOST}:${CONFIG.PORT}/accounts/pay`, {registration_id:id}, {headers:{'Content-Type':"text/plain"}});
		return response;
	}
}
