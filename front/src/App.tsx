import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BillApi } from './api/BillApi';
import { PickMode } from './PickMode';
import { AdminHome } from './views/admin/AdminHome';
import { Home } from './views/client/Home';

export const App = () => {
	return <BrowserRouter>
		<Routes>
			<Route path="/admin/*" element={<AdminHome />}></Route>
			<Route path="/client/*" element={<Home />}></Route>
			<Route path="/" element={<PickMode />}></Route>
		</Routes>
	</BrowserRouter>
}

