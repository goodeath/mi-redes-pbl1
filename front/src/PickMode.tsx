import React from 'react';
import { Link } from 'react-router-dom';
export const PickMode = () => {
	return <div>
		<Link to="/admin">Administrador</Link> <br />
		<Link to="/client">Usuário</Link>
	</div>
}
