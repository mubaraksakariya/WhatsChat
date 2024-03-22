import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Contexts/AuthContext';
import { Dropdown } from 'flowbite-react';
import ChatPageUser from './ChatPageUser';

function ChatPageNav({ user }) {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const startVideoCall = () => {
		console.log('Video call');
	};
	const startAudioCall = () => {
		console.log('Audio call');
	};

	return (
		<div className='flex justify-between bg-themeBlueSecondary  py-7 px-5 text-warmGray-300 relative'>
			<div className='flex items-center gap-3'>
				{/* back button */}
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
					<ChatPageUser user={user} />
				</div>
			</div>
			<div className='flex items-center gap-5'>
				<div className='cursor-pointer' onClick={startVideoCall}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						fill='currentColor'
						className='w-6 h-6'>
						<path d='M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z' />
					</svg>
				</div>
				<div className='cursor-pointer' onClick={startAudioCall}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 28 28'
						fill='currentColor'
						className='w-6 h-6'>
						<path
							fillRule='evenodd'
							d='M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z'
							clipRule='evenodd'
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

export default ChatPageNav;
