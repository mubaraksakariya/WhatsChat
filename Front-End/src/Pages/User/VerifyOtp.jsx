import React, { useState } from 'react';
import './VerifyOtp.css';
import { useAxios } from '../../Contexts/AxiosContext';
import { useNavigate } from 'react-router-dom';
import CountDownTimer from '../../Components/CountDownTimer';
import { useAuth } from '../../Contexts/AuthContext';

function VerifyOtp() {
	const axios = useAxios();
	const navigate = useNavigate();
	const [message, setMessage] = useState('');
	const { login, setLoggedInUser } = useAuth();
	const onReset = () => {
		let email = localStorage.getItem('email');
		const data = {
			email,
		};
		axios.post('login', data).then((response) => {
			console.log(response);
			if (response.status === 202) {
				console.log('done');
				setMessage('Requested for a new OTP');
			}
		});
	};
	const manageVerify = (e) => {
		e.preventDefault();
		const data = {
			otp: e.target.otp.value,
			email: localStorage.getItem('email'),
		};
		axios.put('login', data).then((response) => {
			if (response.status === 200 && response.data.result) {
				setMessage(response.data.message);
				localStorage.setItem('token', response.data.token);
				login();
				setLoggedInUser(response.data.email);
				navigate('/');
			}
			if (response.status === 200 && !response.data.result) {
				setMessage(response.data.message);
			}
		});
	};
	return (
		<div className='relative flex flex-col justify-center items-center min-h-[100dvh] max-h-[100dvh] min-w-[100%]'>
			<form className=' w-8/12' onSubmit={manageVerify}>
				<div className=' mb-10'>
					<h1 className=' text-2xl font-semibold text-center text-white'>
						Enter OTP
					</h1>
				</div>
				<div className='my-3'>
					<input
						type='text'
						id='otp '
						className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						placeholder='00000'
						required
						name='otp'
					/>
				</div>
				<div className=' my-3 flex justify-center'>
					<button
						type='submit'
						className='focus:outline-none text-white bg-themeGreenButton1 hover:bg-themeGreenButton3 focus:ring-2 focus:ring-bu font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-themeGreenButton1 dark:hover:bg '>
						Verify
					</button>
				</div>
				<div className=' my-3 flex justify-center'>
					<CountDownTimer onReset={onReset} />
				</div>
				<div className=' my-3 flex justify-center'>
					<span className=' text-red-600'>{message}</span>
				</div>
			</form>
		</div>
	);
}

export default VerifyOtp;
