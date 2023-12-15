import React from 'react';
import './HomePage.css';
import { useAuth } from '../../Contexts/AuthContext';

function HomePage() {
	const { logout } = useAuth();
	return (
		<>
			<h1>Home</h1>
			<button
				type='button'
				onClick={logout}
				className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>
				Logout
			</button>
		</>
	);
}

export default HomePage;
