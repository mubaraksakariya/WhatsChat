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
import { useState } from 'react';
import { useAuth } from './Contexts/AuthContext';
import NewChat from './Pages/User/NewChat';
import NewContact from './Pages/User/NewContact';
import ChatPage from './Pages/User/ChatPage';
import { ConfirmationProvider } from './Contexts/ConfirmationContext';

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
					path: 'newchat',
					element: isAuthenticated ? (
						<NewChat setIsDark={setIsDark} />
					) : (
						<Navigate to='/signup' />
					),
				},
				{
					path: 'new-contact',
					element: isAuthenticated ? (
						<NewContact setIsDark={setIsDark} />
					) : (
						<Navigate to='/signup' />
					),
				},
				{
					path: 'chat',
					element: isAuthenticated ? (
						<ChatPage setIsDark={setIsDark} />
					) : (
						<Navigate to='/signup' />
					),
				},
				{
					path: '/admin',
					children: [
						{
							path: '',
							element: isAuthenticated ? (
								<Admin />
							) : (
								<Navigate to='/signup' />
							),
						},
					],
				},
			],
		},
	]);
	if (isLoading) {
		return <h1 className='text-red'>Loading</h1>;
	} else
		return (
			<div className={isDark ? 'dark' : ''}>
				<div className=' min-h-screen bg-black flex justify-center  items-center'>
					<div className='w-screen max-w-lg  bg-themeBlue  min-h-screen flex justify-center  items-center'>
						<ConfirmationProvider>
							<RouterProvider router={router} />
						</ConfirmationProvider>
					</div>
				</div>
			</div>
		);
}

export default App;
