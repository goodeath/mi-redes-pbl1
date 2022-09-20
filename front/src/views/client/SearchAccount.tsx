import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import { BillApi } from '../../api/BillApi';

export const SearchAccount = () => {
	const [reg, setreg] = useState<string>('');
	const setRegistration = (registration: string) =>  {
		window.localStorage.setItem('register', registration);
	}
	const n= useNavigate();
	const find = async (r: string) => {
		console.log("search");
		const api = new BillApi();
		const data = await api.list(r);
		if(data){
			setRegistration(r);
			n('account/list');
		}
	}




	return <div>
		<input onChange={ (e) => setreg(e.target.value) } type="text" placeholder="Matrícula" name="LO"/>
		<button type="button" onClick={function() {find(reg)}}>Procurar</button>
	</div>;	
}
