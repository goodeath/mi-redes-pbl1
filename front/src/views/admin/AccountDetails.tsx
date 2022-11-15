import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom';
import { BillApi } from '../../api/BillApi';
import { Bar, Line } from 'react-chartjs-2';
import { groupBy } from 'lodash';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  	PointElement,
  BarElement,
  Title,
  	 LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { HidrometerApi } from '../../api/HidrometerApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  	PointElement,
  BarElement,
  Title,
  	 LineElement,
  Tooltip,
  Legend
);


export const AccountDetails = () => {
	const params = useParams();
	const getHistory = async () => {
		const api = new BillApi();
		const data = await api.history(+params.id);
		return data;
	}
	const close = async()=>{
		const api = new BillApi();
		const data = await api.close(bill.registration_id);
		update_chart(filter);
	}

	const getDetails = (id) => {
		const hidrometerApi = new HidrometerApi();
		return hidrometerApi.getDetails(id);
	}

	const configure = (id, flow:number) => {
		const hidrometerApi = new HidrometerApi();
		return hidrometerApi.configureFlow(id, flow);
	}

	const [bill, setBill] = useState<any>({});
	const [history, setHistory] = useState<any>({});
	const [chartData, setChartData] = useState<any[]>([]);
	const [filter, setFilter] = useState<number>(0);
	const [flow, setFlow] = useState<number>(0);
	const [flowc, setFlowc] = useState<string>('0');
	const timeout = useRef(null);

	useEffect(() => {
		console.log("Filter", filter);
		if(!timeout.current){
		//update_chart(filter);
			timeout.current = setTimeout(() => {
				timeout.current = null;
				update_chart(filter)

			}, 5000);
		}
	}, [filter, history]);

	const update_chart = (filter: number) => {

		let dd = {
			0: {},
			1: {minute: 'numeric'},
			2: {minute: 'numeric', second: 'numeric'},
		}
		getHistory().then( async response => {
			let data = response.data.consumption;
			setBill(response.data.bill);
			//const info = await getDetails(response.data.bill.registration_id);
			//setFlow(info.data.flow_rate);
			data = groupBy(data, (d) => {
				const options = {year: 'numeric', month: 'numeric', day: 'numeric',
				  hour: 'numeric', ...(dd[filter])};
				data.date_created = new Intl.DateTimeFormat('pt-BR',options).format(new Date(d.date_created))
				return data.date_created;
			});
			for(let x in data) {
				data[x] = data[x].reduce( (a,b) =>{
					let r = 0; 
					r += typeof a == 'number' ? a : a.consumption;
					r += typeof b == 'number' ? b : b.consumption;
					return r;
				});
				if(typeof data[x] != 'number') data[x] = data[x].consumption;
			}

			if(filter == 2) data = Object.fromEntries(Object.entries(data).slice( Math.max(Object.entries(data).length-24,0)));
			console.log(data);
			setHistory(data);
		});
	}

	useEffect(() => {
		update_chart(filter);
	},[]);
	 let f = {
	 	 0:Object.keys(history).map( k => k+=":00"),
	 	 1:Object.keys(history).map( h => h.split(" ")[1]),
	 	 2:Object.keys(history)
	 }
	let consumption:number = 0;
	if(Object.keys(history).length > 0) consumption = Object.values(history).reduce((a:any,b:any) => {return a+b;}) as number;
	return <div>
		<select onChange={ (e:any) =>{
			setFilter(Number(e.target.value))
			clearTimeout(timeout.current);
			update_chart(e.target.value);

			timeout.current = setTimeout(() => {
				timeout.current = null;
				update_chart(e.target.value)

			}, 5000);
		}}>
			<option value="0">Por hora</option>
			<option value="1">Por minuto</option>
			<option value="2">Últimos 120 segundos</option>
		</select>
		<h4>Status: {bill.closed ? "Fechado" : "Em aberto"} </h4>
		{bill?.closed ? <h4> Pagamento: {bill.paid ? "Pago" : "Pendente"} </h4> : null }
		<h4>Consumo: {consumption*0.003} m³</h4>
		<h4>Valor: R$ {consumption*0.003*15}</h4>
		<div style={{width:"70%", margin:'0 auto'}}>
		<Line options={{
  			  responsive: true,
  			  plugins: {
    			legend: {
      			  position: 'top' as const,
    			},
    			title: {
      			  display: true,
      			  text: 'Consumo (m³)',
    			},
  			  },
			}} 
		data={{
			labels:  f[filter],
			datasets:[
				{ label: 'Consumo', data: Object.values(history),backgroundColor: 'rgba(53, 162, 235, 0.5)'},
			]
		}} />
		</div>
		<input onChange={ (e) => setFlowc(e.target.value) } type="text" placeholder="Vazão" />
		<button onClick={() => configure(bill.registration_id,+flowc)}>Ajustar Vazão</button>
		
	</div>;	
}
