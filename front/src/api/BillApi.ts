import Axios, { AxiosInstance } from 'axios';
import { CONFIG } from '../config';


export class BillApi {
	private axios: AxiosInstance;

	constructor(){
		this.axios = Axios.create();
	}

	public list = async (r?: string) => {
		const response = this.axios.get(`http://${CONFIG.HOST}:${CONFIG.PORT}/hidrometer/top_five`, {params:{r}});
		return response;
	}


	public history = async (id: number) => {
		const response = this.axios.get(`http://${CONFIG.HOST}:${CONFIG.PORT}/hidrometer/history?bill_id=${id}`);
		return response;
	}

	
	public close = async (id: number) => {
		const response = this.axios.post(`http://${CONFIG.HOST}:${CONFIG.PORT}/accounts/close`, {registration_id:id}, {headers:{'Content-Type':"text/plain"}});
		return response;
	}


	public pay = async (id: number) => {
		const response = this.axios.post(`http://${CONFIG.HOST}:${CONFIG.PORT}/accounts/pay`, {registration_id:id}, {headers:{'Content-Type':"text/plain"}});
		return response;
	}
}
