import React, { useEffect, useState } from 'react';
import AudioControls from './AudioControls'; // Create a separate component for audio controls

function AudioEditor({ audioBlob, onDelete, confirmEdit }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [audio, setAudio] = useState(null);

	const togglePlay = () => {
		setIsPlaying(!isPlaying);
	};

	const deleteAudio = () => {
		onDelete();
		console.log('delete');
	};
	const manageSend = () => {
		confirmEdit();
	};
	useEffect(() => {
		if (audio) {
			isPlaying ? audio.play() : audio.pause();
		} else setAudio(new Audio(URL.createObjectURL(audioBlob)));
	}, [isPlaying]);

	return (
		<div className='w-full absolute left-0 bottom-1 animate-slide-in rounded-full bg-themeBlueSecondary p-2 flex justify-between items-center'>
			<div className='flex-1'>
				{audio && (
					<AudioControls
						isPlaying={isPlaying}
						onTogglePlay={togglePlay}
						audio={audio}
					/>
				)}
			</div>

			<div className='flex gap-2 '>
				<button className='' onClick={deleteAudio}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						fill='currentColor'
						className='w-6 h-6  text-red-800 hover:text-red-600 active:text-red-950 '>
						<path
							fillRule='evenodd'
							d='M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z'
							clipRule='evenodd'
						/>
						{/* delete icon */}
					</svg>
				</button>

				<button
					className=' mx-1 px-1 rounded-full bg-themeGreenButton1 hover:bg-themeGreenButton2 active:bg-themeGreenButton3 aspect-square transition-all'
					onClick={manageSend}>
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
							d='M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15'
						/>
						{/* send icon */}
					</svg>
				</button>
			</div>
		</div>
	);
}

export default AudioEditor;
