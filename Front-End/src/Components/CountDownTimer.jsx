import React from 'react';
import { useTimer } from 'react-timer-hook';
import './CountDownTimer.css';

function CountDownTimer({ onReset }) {
	const expiryTimestamp = new Date();
	expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 0);

	const { seconds, minutes, isRunning, restart } = useTimer({
		expiryTimestamp,
		onExpire: () => console.log('Timer expired'),
	});
	const resetTimer = (e) => {
		e.preventDefault();
		const time = new Date();
		time.setSeconds(time.getSeconds() + 119);
		restart(time);
		onReset();
	};

	return (
		<div>
			{!isRunning ? (
				<button
					type='button'
					onClick={resetTimer}
					className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>
					Resend
				</button>
			) : (
				<h1 className='py-3 text-stone-400'>
					Retry in : {minutes}:{seconds}
				</h1>
			)}
		</div>
	);
}

export default CountDownTimer;
