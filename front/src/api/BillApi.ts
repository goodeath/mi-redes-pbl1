import Axios, { AxiosInstance } from 'axios';

export class BillApi {
	private axios: AxiosInstance;

	constructor(){
		this.axios = Axios.create();
	}

	public list = async (r?: string) => {
		const response = this.axios.get(`http://localhost:9092/accounts/list`, {params:{r}});
		return response;
	}


	public history = async (id: number) => {
		const response = this.axios.get(`http://localhost:9092/accounts/history?bill_id=${id}`);
		return response;
	}

	
	public close = async (id: number) => {
		const response = this.axios.post(`http://localhost:9092/accounts/close`, {registration_id:id}, {headers:{'Content-Type':"text/plain"}});
		return response;
	}


	public pay = async (id: number) => {
		const response = this.axios.post(`http://localhost:9092/accounts/pay`, {registration_id:id}, {headers:{'Content-Type':"text/plain"}});
		return response;
	}
}
