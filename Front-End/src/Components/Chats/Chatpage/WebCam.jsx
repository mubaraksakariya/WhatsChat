import React from 'react';
import Webcam from 'react-webcam';

function WebCam({ setCameraOn, setImage }) {
	return (
		<Webcam audio={false} screenshotFormat='image/jpeg'>
			{({ getScreenshot }) => (
				<>
					<button
						className='absolute top-3 right-3'
						onClick={() => setCameraOn(false)}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-6 h-6 text-white'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 18 18 6M6 6l12 12'
							/>
						</svg>
					</button>
					<button
						className=' bg-slate-300 rounded-full min-w-[4rem] aspect-square hover:bg-slate-400 active:bg-slate-600 absolute bottom-0 mb-5'
						onClick={() => {
							const imageSrc = getScreenshot();
							setImage(imageSrc);
							setCameraOn(false);
						}}></button>
				</>
			)}
		</Webcam>
	);
}

export default WebCam;
