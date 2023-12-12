import React, { useContext, useEffect, useMemo, useState } from 'react';
import './SignUp.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useAxios } from '../../contexts/AxiosContext';
import { useNavigate } from 'react-router-dom';

function SignUp({ setIsDark }) {
	// const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [QrError, setQrError] = useState('');
	const navigate = useNavigate();
	const axios = useAxios();

	const manageNext = (e) => {
		e.preventDefault();
		setEmail(e.target.email.value);
		const data = {
			email,
		};
		axios.post('login', data).then((response) => {
			console.log(response);
			if (response.status === 202) {
				localStorage.setItem('email', email);
				navigate('/verify');
				console.log('done');
			}
		});
	};
	const manageQrCode = () => {
		setQrError('This facilty is not available right now');
		setTimeout(() => {
			setQrError('');
		}, 5000);
	};
	return (
		<>
			<div className='relative min-h-screen bg-themeBlue flex justify-center  items-center'>
				<form className=' w-8/12 sm:w-2/6' onSubmit={manageNext}>
					<div className=' mb-10'>
						<h1 className=' text-2xl font-semibold text-center text-white'>
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
						/>
					</div>
					{/* <div className=' my-3'>
						<PhoneInput
							country={'in'}
							value={phone.phone}
							onChange={(phone) => setPhone(phone)}
						/>
					</div> */}
					<div className=' my-3 flex justify-center'>
						<button
							type='submit'
							className='focus:outline-none text-white bg-themeGreenButton1 hover:bg-themeGreenButton3 focus:ring-2 focus:ring-bu font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-themeGreenButton1 dark:hover:bg '>
							Next
						</button>
					</div>
					<div className=' my-3 flex justify-center'>
						<span
							className=' text-themeGreenButton1 hover:cursor-pointer hover:text-themeGreenButton2'
							onClick={manageQrCode}>
							Link with QR code
						</span>
					</div>

					<div className='my-3 h-20 text-center'>
						<span className=' text-themeError'>{QrError}</span>
					</div>
				</form>
			</div>
		</>
	);
}

export default SignUp;
