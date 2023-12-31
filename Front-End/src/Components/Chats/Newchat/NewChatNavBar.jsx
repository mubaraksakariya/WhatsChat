import React from 'react';
import { useAuth } from '../../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'flowbite-react';

function NewChatNavBar() {
	const { logout } = useAuth();
	const navigate = useNavigate();
	return (
		<div className='flex justify-between bg-themeBlueSecondary py-5 px-5'>
			<div className='flex items-center gap-3'>
				<div className='cursor-pointer' onClick={() => navigate('/')}>
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
							d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3'
						/>
					</svg>
				</div>
				<div>
					<h3>Select Contact</h3>
					<p className='text-xs'>100 contacts</p>
				</div>
			</div>
			<div className='flex items-center gap-3'>
				<div>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='w-6 h-6'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
						/>
					</svg>
				</div>
				<div>
					<Dropdown
						label=':'
						placement='left-start'
						renderTrigger={() => (
							<button className='text-warmGray-300 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 hover:text-white p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									strokeWidth={1.5}
									stroke='currentColor'
									className='w-6 h-6'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
									/>
								</svg>
							</button>
						)}>
						<Dropdown.Item>Dashboard</Dropdown.Item>
						<Dropdown.Item>Settings</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Item onClick={() => logout()}>
							Sign out
						</Dropdown.Item>
					</Dropdown>
				</div>
			</div>
		</div>
	);
}

export default NewChatNavBar;
