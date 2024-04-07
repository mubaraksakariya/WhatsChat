import React, { useEffect } from 'react';
import CameraListDropDown from './CameraListDropDown';
import { getMediaStream, makeVideoCall } from './VideoCallHelper';
import { useVideoCall } from '../VideoCallContext';
// import VideoCallRinger from './VideoCallRinger';

function VideoCaller({ user, loggedInUser }) {
	const { rejectCall, peerConnection } = useVideoCall();

	useEffect(() => {
		makeVideoCall(user, loggedInUser, peerConnection);
	}, []);

	return (
		<div className='absolute inset-0 max-w-lg bg-themeBlue'>
			<div className=' min-h-full flex flex-col justify-center items-center'>
				<div className='w-full flex-1 bg-green-700 flex flex-col justify-center items-center'>
					<div>video calling </div>
					<div>{user.email}</div>
				</div>
				<div className=' w-full bg-red-700'>
					<div className='absolute bottom-10 left-0 right-0 flex justify-center'>
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
		</div>
	);
}

export default VideoCaller;
