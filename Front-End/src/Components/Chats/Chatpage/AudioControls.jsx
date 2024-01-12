import React, { useState, useEffect, useRef } from 'react';

function AudioControls({ isPlaying, onTogglePlay, audio }) {
	const [progress, setProgress] = useState(0);
	const btnRef = useRef(null);
	useEffect(() => {
		const updateProgress = () => {
			const duration = audio.duration || 1;
			const currentTime = audio.currentTime || 0;
			const calculatedProgress = (currentTime / duration) * 100;
			setProgress(calculatedProgress);
		};

		const progressListener = () => {
			updateProgress();
		};

		const endedListener = () => {
			// onTogglePlay;
			setProgress(0);
			btnRef.current.click();
		};

		audio.addEventListener('timeupdate', progressListener);
		audio.addEventListener('ended', endedListener);

		return () => {
			audio.removeEventListener('timeupdate', progressListener);
			audio.removeEventListener('ended', endedListener);
		};
	}, [audio]);

	const handleSeek = (e) => {
		const clickPosition =
			e.pageX - e.currentTarget.getBoundingClientRect().left;
		const totalWidth = e.currentTarget.clientWidth;
		const percentage = (clickPosition / totalWidth) * 100;
		const duration = audio.duration || 1;
		const seekTime = (percentage / 100) * duration;

		audio.currentTime = seekTime;
	};
	return (
		<div className='flex items-center'>
			<button onClick={onTogglePlay} className='ps-2' ref={btnRef}>
				{isPlaying ? (
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
							d='M15.75 5.25v13.5m-7.5-13.5v13.5'
						/>
						{/* Pause icon */}
					</svg>
				) : (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='w-6 h-6'>
						{/* Play Icon */}
						<path d='M5 3l14 9L5 21V3z' />
					</svg>
				)}
			</button>
			<div className='relative flex-grow mx-4  h-[0.5rem] '>
				<div className='absolute left-0 top-0 h-full bg-gray-500 w-full rounded-full'></div>
				<div
					className='absolute left-0 top-0 h-full bg-green-500 transition-all motion-reduce:ease-in-out rounded-full'
					style={{ width: `${progress}%` }}></div>
				<div
					className='absolute left-0 top-0 h-full w-2 bg-transparent'
					style={{ width: '100%' }}
					onClick={handleSeek}></div>
			</div>
		</div>
	);
}

export default AudioControls;
