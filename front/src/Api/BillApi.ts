import Axios, { AxiosInstance } from 'axios';

export class BillApi {
	private axios: AxiosInstance;

	constructor(){
		this.axios = Axios.create();
	}

	public list = async () => {
		const response = this.axios.get(`http://localhost:9092/accounts/list`);
		console.log(response);
	}
}
