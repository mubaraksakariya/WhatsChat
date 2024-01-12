import React, { useEffect, useState } from 'react';
import './ChatInputButton.css';
import AudioRecorder from './AudioRecorder';
import AudioEditor from './AudioEditor';

function AudioInputButton({ icon, file }) {
	const [animate, setAnimate] = useState(false);
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [timerSeconds, setTimerSeconds] = useState(0);
	const [cancel, setCancel] = useState(false);
	const [audioFileForEdting, setAudioFileForEdting] = useState(null);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		let intervalId;

		if (isTimerRunning) {
			intervalId = setInterval(() => {
				setTimerSeconds((prevSeconds) => prevSeconds + 1);
			}, 1000); // Update every 1000 milliseconds (1 second)
		}

		return () => clearInterval(intervalId);
	}, [isTimerRunning]);

	const startRecording = () => {
		setTimerSeconds(0);
		setCancel(false);
		setIsTimerRunning(true);
	};

	const stopRecording = () => {
		setIsTimerRunning(false);
	};

	const cancelRecording = () => {
		setCancel(true);
		stopRecording();
	};

	const receiveAudioBlob = (audioBlob) => {
		setAudioFileForEdting(audioBlob);
		// const audioUrl = URL.createObjectURL(audioBlob);
		// const audio = new Audio(audioUrl);
		// audio.play();
	};

	const deleteFile = () => {
		setAudioFileForEdting(null);
	};

	const confirmEdit = () => {
		console.log('confirmed audio to send');
		setIsEditing(false);
		file(audioFileForEdting);
	};

	const formatTime = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;

		const formatNumber = (number) =>
			number < 10 ? `0${number}` : `${number}`;

		return `${formatNumber(minutes)}:${formatNumber(remainingSeconds)}`;
	};

	useEffect(() => {
		if (!cancel && audioFileForEdting && timerSeconds >= 1) {
			setIsEditing(true);
		} else setIsEditing(false);
	}, [audioFileForEdting]);

	useEffect(() => {
		setAnimate(true); // Trigger animation on component mount
	}, []);

	return (
		<>
			<AudioRecorder start={isTimerRunning} onStop={receiveAudioBlob} />
			{/* Recording indicator */}
			{isTimerRunning && (
				<div className='w-full absolute left-0 animate-slide-in rounded-full bg-themeBlueSecondary p-2 ms-2 flex'>
					<div className='flex flex-1'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='currentColor'
							className='w-6 h-6 text-red-600 animate-fade-in-out mx-2'>
							<path d='M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z' />
							<path d='M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z' />
						</svg>
						{formatTime(timerSeconds)}
					</div>
					<div className='flex-1'>slide out to cancel</div>
				</div>
			)}
			{isEditing && (
				<AudioEditor
					audioBlob={audioFileForEdting}
					onDelete={deleteFile}
					onSend={file}
					confirmEdit={confirmEdit}
				/>
			)}
			<button
				className={`mx-2 px-2 rounded-full bg-themeGreenButton1 hover:bg-themeGreenButton2 active:bg-themeGreenButton3 aspect-square transition-all ${
					isTimerRunning
						? 'absolute right-1 bottom-1 scale-[200%]'
						: ''
				}`}
				onTouchStart={startRecording}
				onTouchEnd={cancelRecording}
				onMouseDown={startRecording}
				onMouseUp={stopRecording}
				onMouseLeave={cancelRecording}>
				{React.cloneElement(icon, {
					className: `w-6 h-6 ${animate ? 'zoomIn' : ''}`, // Apply zoomIn class conditionally
				})}
			</button>
		</>
	);
}

export default AudioInputButton;
