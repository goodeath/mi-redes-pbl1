import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AccountDetails } from './AccountDetails';
import { AccountList } from './AccountList';

export const AdminHome = () => {
	return	<Routes>
		<Route path="/account/details/:id" element={<AccountDetails />}></Route>
		<Route path="/" element={<AccountList />}></Route>
	</Routes>
}
