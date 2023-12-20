import React from 'react';
import { useAuth } from '../../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
						dataSlot='icon'
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
					<button
						id='dropdownOffsetButton'
						data-dropdown-toggle='dropdown'
						data-dropdown-placement='left'
						data-dropdown-offset-distance='1'
						data-dropdown-offset-skidding='100'
						className='text-warmGray-300 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 hover:text-white p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent'>
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
					<div
						id='dropdown'
						className='z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600'>
						<ul
							className='py-2 text-sm text-gray-700 dark:text-gray-400'
							aria-labelledby='dropdownLargeButton'>
							<li>
								<a
									href='#'
									className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
									Dashboard
								</a>
							</li>
							<li>
								<a
									href='#'
									className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
									Settings
								</a>
							</li>
						</ul>
						<div className='py-1'>
							<a
								onClick={logout}
								href='#'
								className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'>
								Sign out
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NewChatNavBar;
