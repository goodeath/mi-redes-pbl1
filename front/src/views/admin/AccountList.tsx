import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { BillApi } from '../../api/BillApi';

export const AccountList = () => {
	const listAccounts = async () => {
		const api = new BillApi();
		const data = await api.list();
		return data;
	}
	const [accounts, setAccounts] = useState<any[]>([]);
	useEffect(() => {
		listAccounts().then( response => {
			response.data = response.data.map( data => {
				data.date_created = new Intl.DateTimeFormat('pt-BR',{year: 'numeric', month: 'numeric', day: 'numeric',
				  hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(new Date(data.date_created))
				return data;
			});
			setAccounts(response.data);
		});
	},[]);
	return <div>
		<table>
			<thead>
				<tr>
					<th>Matrícula</th>
					<th>Data de abertura</th>
					<th>Status</th>
					<th>Ação</th>
				</tr>
			</thead>
			<tbody>
				{accounts.map ((account) => {
					return <tr>
						<td>{account.registration_id}</td>
						<td>{account.date_created}</td>
						<td>{account.closed ? 'Fechado' : 'Em aberto'}</td>
						<td><Link to={`account/details/${account.id}`}>Detalhes</Link></td>
					</tr>
				})}
			</tbody>
		</table>
	</div>;	
}

