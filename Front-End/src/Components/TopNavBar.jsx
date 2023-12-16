import React from 'react';
import { useAuth } from '../Contexts/AuthContext';
import './TopNavBar.css';
function TopNavBar() {
	const { logout } = useAuth();
	return (
		<div className='flex justify-between p-5'>
			<div>
				<h3 className='text-2xl'>WhatsChat</h3>
			</div>
			<div className='flex gap-5'>
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
						d='M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z'
					/>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z'
					/>
				</svg>
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

				<button
					id='dropdownOffsetButton'
					data-dropdown-toggle='dropdownLeft'
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
					id='dropdownLeft'
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
	);
}

export default TopNavBar;
