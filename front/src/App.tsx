import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PickMode } from './PickMode';
import { AdminHome } from './views/admin/AdminHome';
import { Home } from './views/client/Home';

export const App = () => {
	return <BrowserRouter>
		<Routes>
			<Route path="/*" element={<AdminHome />}></Route>
		</Routes>
	</BrowserRouter>
}

