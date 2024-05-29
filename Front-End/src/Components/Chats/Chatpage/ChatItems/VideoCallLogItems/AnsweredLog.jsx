import React, { useEffect, useState } from 'react';
import { calculateCallDuration } from '../../../../../HelperApi/CallLogApi';

function AnsweredLog({ callLog, returnCall }) {
	const [duration, setDuration] = useState();
	const makeVidoeCall = () => {
		returnCall();
	};
	useEffect(() => {
		const duration = calculateCallDuration(
			callLog.callStartingTime,
			callLog.callEndingTime
		);
		setDuration(duration);
	}, []);

	return (
		<div
			className=' flex gap-2 p-1 bg-themChat2 cursor-pointer'
			title={callLog.explanation}
			onClick={makeVidoeCall}>
			<div className=' flex flex-col justify-center items-center p-3 rounded-full bg-themChat1'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					fill='currentColor'
					className='w-6 h-6'>
					<path d='M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z' />
				</svg>
			</div>
			<div>
				Video call
				<div>{duration}</div>
			</div>
		</div>
	);
}

export default AnsweredLog;
