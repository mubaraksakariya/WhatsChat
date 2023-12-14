import React from 'react';
import { useTimer } from 'react-timer-hook';
import './CountDownTimer.css';

function CountDownTimer({ onReset }) {
	const expiryTimestamp = new Date();
	expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 60);

	const { seconds, minutes, isRunning, restart } = useTimer({
		expiryTimestamp,
		onExpire: () => console.log('Timer expired'),
	});

	return (
		<div>
			<h1>
				Timer: {minutes}:{seconds}
			</h1>
			<button
				disabled={isRunning}
				onClick={(e) => {
					e.preventDefault();
					const time = new Date();
					time.setSeconds(time.getSeconds() + 5);
					restart(time);
					onReset();
				}}>
				Restart
			</button>
		</div>
	);
}

export default CountDownTimer;
