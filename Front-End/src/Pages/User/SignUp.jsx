import React, { useState, useEffect } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { useAxios } from '../../Contexts/AxiosContext';

function SignUp() {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const axios = useAxios();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setIsLoading(true);
			setError(''); // Clear any previous errors

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				throw new Error('Invalid email format');
			}

			const response = await axios.post('login', { email });

			if (response.status === 202) {
				localStorage.setItem('email', email);
				navigate('/verify');
			} else {
				setError('Login failed');
			}
		} catch (error) {
			console.error(error);
			setError(error.message || 'An error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form className='w-8/12 p-5' onSubmit={handleSubmit}>
			<div className='mb-10'>
				<h1 className='text-2xl font-semibold text-center text-white'>
					Enter Email
				</h1>
			</div>
			<div className='my-3'>
				<input
					type='email'
					id='email'
					className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
					placeholder='john.doe@company.com'
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div className='my-3 flex justify-center'>
				<button
					type='submit'
					className='focus:outline-none text-white bg-themeGreenButton1 hover:bg-themeGreenButton3 focus:ring-2 focus:ring-bu font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-themeGreenButton1 dark:hover:bg-themeGreenButton2'
					disabled={isLoading} // Disable button during loading
				>
					{isLoading ? 'Loading...' : 'Next'}
				</button>
			</div>

			<div className='my-3 h-10 text-center'>
				<span className='text-themeError'>{error}</span>
			</div>
		</form>
	);
}

export default SignUp;
