import React, { useEffect } from 'react';
import CameraListDropDown from './CameraListDropDown';
import { getMediaStream, makeVideoCall } from './VideoCallHelper';
// import VideoCallRinger from './VideoCallRinger';

function VideoCallMain({
	localMediaStream,
	// setLocalMediaStream,
	remoteMediaStream,
	// setRemoteMediaStream,
	selectedDevice,
	setSelectedDevice,
	// user,
	// loggedInUser,
	// isRinging,
	// startRinging,
}) {
	return (
		<div className='absolute inset-0 max-w-lg bg-themeBlue'>
			<div className='flex flex-col justify-center items-center'>
				{/* self camera  */}
				<div>
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
				{/* remote user camera , absolute position */}
				<div className='absolute bottom-5 right-5 max-w-[30%] z-10'>
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
			</div>
			<div className='absolute z-0 bottom-5 left-2'>
				<CameraListDropDown />
			</div>
		</div>
	);
}

export default VideoCallMain;
