import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './Pages/User/HomePage';
import SignUp from './Pages/User/SignUp';
import Admin from './Pages/Admin/Admin';
import { useState } from 'react';
import VerifyOtp from './Pages/User/VerifyOtp';

function App() {
	const [isDark, setIsDark] = useState(false);
	const router = createBrowserRouter([
		{
			path: '/',
			children: [
				{
					path: '',
					element: <HomePage />,
				},
				{
					path: 'signup',
					element: <SignUp setIsDark={setIsDark} />,
				},
				{
					path: 'verify',
					element: <VerifyOtp setIsDark={setIsDark} />,
				},

				{
					path: '/admin',
					children: [
						{
							path: '',
							element: <Admin />,
						},
					],
				},
			],
		},
	]);

	return (
		<div className={isDark ? 'dark' : ''}>
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
