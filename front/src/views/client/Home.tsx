import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AccountDetails } from './AccountDetails';
import { AccountList } from './AccountList';
import { SearchAccount } from './SearchAccount';

export const Home = () => {
	return	<Routes>
		<Route path="/account/details/:id" element={<AccountDetails />}></Route>
		<Route path="/account/list" element={<AccountList />}></Route>
		<Route path="/" element={<SearchAccount />}></Route>
	</Routes>
}
