import React, { useEffect, useRef } from 'react';
import CameraListDropDown from './CameraListDropDown';
import { useVideoCall } from '../VideoCallContext';

function VideoCallMain() {
	const { localMediaStream, remoteMediaStream, rejectCall } = useVideoCall();

	useEffect(() => {
		if (remoteMediaStream)
			console.log(`remote media is ${remoteMediaStream}`);
		else console.log('no remote media stream');
	}, [remoteMediaStream]);

	return (
		<div className='absolute inset-0 max-w-lg bg-themeBlue'>
			<div className='flex flex-col justify-center items-center'>
				{/* self camera  */}
				<div>
					{remoteMediaStream && (
						<video
							ref={(videoElement) => {
								if (videoElement) {
									videoElement.srcObject = remoteMediaStream;
								}
							}}
							autoPlay
							playsInline
							controls
						/>
					)}
				</div>
				{/* remote user camera , absolute position */}
				<div className='absolute bottom-5 right-5 max-w-[30%] z-10'>
					{localMediaStream && (
						<video
							ref={(videoElement) => {
								if (videoElement) {
									videoElement.srcObject = localMediaStream;
								}
							}}
							autoPlay
							playsInline
							controls
						/>
					)}
				</div>
			</div>

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

			{/* <div className='absolute z-0 bottom-5 left-2'>
				<CameraListDropDown />
			</div> */}
		</div>
	);
}

export default VideoCallMain;
