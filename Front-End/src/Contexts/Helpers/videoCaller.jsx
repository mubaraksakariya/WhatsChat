import React from 'react';
import { useVideoCall } from '../VideoCallContext';
import { useAuth } from '../AuthContext';

// the user who is initiating the call, can end the call

function VideoCaller({ user, callState }) {
	const { rejectCall } = useVideoCall();
	const { loggedInUser } = useAuth();

	return (
		<div className='absolute inset-0 max-w-lg bg-themeBlue'>
			<div className=' min-h-full flex flex-col justify-center items-center'>
				<div className='w-full flex-1 bg-green-700 flex flex-col justify-center items-center'>
					<div>{callState}</div>
					<div>{user.email}</div>
				</div>
				<div className=' w-full bg-red-700'>
					<div className='absolute bottom-10 left-0 right-0 flex justify-center'>
						<button
							className='p-[3vh] bg-red-700 rounded-full hover:bg-red-800 active:bg-red-900'
							onClick={(e) => {
								e.preventDefault();
								rejectCall(loggedInUser, user, 'rejected');
							}}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='w-8 h-8'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VideoCaller;
