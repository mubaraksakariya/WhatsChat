import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Contexts/AuthContext';

function NewContactNavBar() {
	const { logout } = useAuth();
	const navigate = useNavigate();
	return (
		<div className='flex justify-between bg-themeBlueSecondary py-7 px-5'>
			<div className='flex items-center gap-3'>
				<div
					className='cursor-pointer'
					onClick={() => navigate('/newchat/')}>
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
					<h2>New contact</h2>
				</div>
			</div>
		</div>
	);
}

export default NewContactNavBar;
