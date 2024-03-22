import React, { useState } from 'react';
import NewContactNavBar from '../../Components/Chats/Newchat/NewContactNavBar';
import { useNavigate } from 'react-router-dom';
import { addContact, isEmailUnique } from '../../HelperApi/ContactApi';

// import PhoneInput from 'react-phone-input-2';

function NewContact() {
	// const [phone, setPhone] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const validateEmail = (email) => {
		// Email validation regex
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const manageSubmit = async (e) => {
		e.preventDefault();
		setError('');
		const first_name = e.target.elements.firstname.value;
		const last_name = e.target.elements.lastname.value;
		const email = e.target.elements.email.value;
		if (!validateEmail(email)) {
			setError('Please enter a valid email address.');
			return;
		}
		const data = {
			first_name,
			last_name,
			email,
		};
		try {
			const isUnique = await isEmailUnique(email);
			if (!isUnique) {
				setError('Email address must be unique.');
				return;
			}

			// Reset error state
			setError('');

			// Add the new contact to IndexedDB
			await addContact(data);

			console.log('Contact added successfully to IndexedDB');

			// Reset the form using the 'e' event object
			e.target.reset();
			navigate(-1);
		} catch (error) {
			console.error('Error performing form submission:', error);
			setError('Error performing form submission:', error);
		}
	};

	return (
		<div className='w-full min-h-[100dvh] text-warmGray-300 relative'>
			<NewContactNavBar />
			<form className='mx-5 mt-5' onSubmit={manageSubmit}>
				<div className=''>
					<div className='flex px-4 pb-7'>
						<span className='inline-flex items-center pe-4 text-sm text-gray-400  dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								// dataSlot='icon'
								className='w-6 h-6'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
								/>
							</svg>
						</span>
						<div className='relative z-0 w-full'>
							<input
								type='text'
								name='firstname'
								id='floating_standard'
								className='block py-2.5 px-0 w-full text-sm text-gray-300 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-themeGreenButton1 focus:outline-none focus:ring-0 focus:border-themeGreenButton1 peer'
								placeholder=' '
							/>
							<label
								htmlFor='floating_standard'
								className='absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]  peer-focus:text-themeGreenButton1 peer-focus:dark:text-themeGreenButton1 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto'>
								First name
							</label>
						</div>
					</div>

					<div className='flex px-4 pb-7'>
						<span className='inline-flex items-end pe-4 text-sm text-transparent dark:bg-gray-600'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								// dataSlot='icon'
								className='w-6 h-6'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
								/>
							</svg>
						</span>
						<div className='relative z-0 w-full'>
							<input
								name='lastname'
								type='text'
								id='floating_standard'
								className='block py-2.5 px-0 w-full text-sm text-gray-300 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-themeGreenButton1 focus:outline-none focus:ring-0 focus:border-themeGreenButton1 peer'
								placeholder=' '
							/>
							<label
								htmlFor='floating_standard'
								className='absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]  peer-focus:text-themeGreenButton1 peer-focus:dark:text-themeGreenButton1 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto'>
								Last name
							</label>
						</div>
					</div>

					<div className='flex px-4 pb-7'>
						<span className='inline-flex items-center pe-4 text-sm text-gray-400  dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								// dataSlot='icon'
								className='w-6 h-6'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
								/>
							</svg>
						</span>
						<div className='relative z-0 w-full'>
							<input
								type='email'
								name='email'
								id='floating_standard'
								className='block py-2.5 px-0 w-full text-sm text-gray-300 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-themeGreenButton1 focus:outline-none focus:ring-0 focus:border-themeGreenButton1 peer'
								placeholder=' '
							/>
							<label
								htmlFor='floating_standard'
								className='absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]  peer-focus:text-themeGreenButton1 peer-focus:dark:text-themeGreenButton1 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto'>
								Email
							</label>
						</div>
					</div>
					{/* <div className='flex px-4 pb-7'>
						<span className='inline-flex items-center pe-4 text-sm text-gray-400  dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								// dataSlot='icon'
								className='w-6 h-6'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
								/>
							</svg>
						</span>
						<div className='relative z-0 w-full'>
							<div className=' my-3'>
								<PhoneInput
									country={'in'}
									value={phone}
									onChange={(phone) => setPhone(phone)}
								/>
							</div>

							<label
								htmlFor='floating_standard'
								className='absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]  peer-focus:text-themeGreenButton1 peer-focus:dark:text-themeGreenButton1 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto'>
								Email
							</label>
						</div>
					</div> */}
					<div className=' text-center pt-5 text-sm text-red-500'>
						<span>{error} </span>
					</div>
				</div>

				<div className='px-4  pb-7 absolute w-full bottom-0 left-0'>
					<button
						type='submit'
						className='focus:outline-none w-full text-white  bg-themeGreenButton1 hover:bg-themeGreenButton2 active:bg-themeGreenButton3 font-medium rounded-lg text-sm  py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>
						Save
					</button>
				</div>
			</form>
		</div>
	);
}

export default NewContact;
