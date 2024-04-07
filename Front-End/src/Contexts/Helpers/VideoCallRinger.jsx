import React from 'react';
import { useVideoCall } from '../VideoCallContext';

function VideoCallRinger({ user }) {
	const { acceptCall, rejectCall } = useVideoCall();

	return (
		<div className='absolute top-0 z-10 min-h-[100dvh] min-w-[100%] flex flex-col justify-center items-center bg-themeBlueSecondary'>
			<div>{user.email}</div>
			<div className=''>is video calling</div>
			<div className='absolute bottom-10 flex gap-20'>
				<div className=''>
					<button
						className='p-[3vh] bg-themeGreen rounded-full hover:bg-themeGreenButton2 active:bg-themeGreenButton3'
						onClick={acceptCall}>
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
								d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
							/>
						</svg>
					</button>
				</div>
				<div className=''>
					<button
						className='p-[3vh] bg-red-700 rounded-full hover:bg-red-800 active:bg-red-900'
						onClick={rejectCall}>
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
	);
}

export default VideoCallRinger;
