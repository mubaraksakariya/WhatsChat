import './App.css';
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from 'react-router-dom';
import HomePage from './Pages/User/HomePage';
import VerifyOtp from './Pages/User/VerifyOtp';
import Admin from './Pages/Admin/Admin';
import SignUp from './Pages/User/SignUp';
import { useState, useEffect } from 'react';
import { useAuth } from './Contexts/AuthContext';

function App() {
	const [isDark, setIsDark] = useState(false);
	const { isAuthenticated, isLoading } = useAuth();

	const router = createBrowserRouter([
		{
			path: '/',
			children: [
				{
					path: '',
					element: isAuthenticated ? (
						<HomePage />
					) : (
						<Navigate to='/signup' />
					),
				},
				{
					path: 'signup',
					element: !isAuthenticated ? (
						<SignUp setIsDark={setIsDark} />
					) : (
						<Navigate to={'/'} />
					),
				},
				{
					path: 'verify',
					element: !isAuthenticated ? (
						<VerifyOtp setIsDark={setIsDark} />
					) : (
						<Navigate to='/' />
					),
				},
				{
					path: '/admin',
					element: isAuthenticated ? (
						<Admin />
					) : (
						<Navigate to='/signup' />
					),
				},
			],
		},
	]);
	if (isLoading) {
		return <h1 className='text-red'>Loading</h1>;
	} else
		return (
			<div className={isDark ? 'dark' : ''}>
				<div className='relative min-h-screen bg-black flex justify-center  items-center'>
					<div className='w-screen max-w-lg  bg-themeBlue  min-h-screen m-y10 flex justify-center  items-center'>
						<RouterProvider router={router} />
					</div>
				</div>
			</div>
		);
}

export default App;
