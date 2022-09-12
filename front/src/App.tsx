import React from 'react';
import { BillApi } from './Api/BillApi';

export const App = () => {
	const listAccounts = async () => {
		const api = new BillApi();
		const data = await api.list();
	}
	return <div>
		Hello React App from scratch
		<button onClick={listAccounts}>Get accounts</button>
	</div>;	
}

