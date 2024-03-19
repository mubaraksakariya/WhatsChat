import React, { useEffect, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

let setIsTypingFunction;
let isTypingState;

function ChatPageUser({ user }) {
	const [isTyping, setIsTyping] = useState(false);
	setIsTypingFunction = setIsTyping;
	isTypingState = isTyping;

	useEffect(() => {
		if (isTyping) {
			setTimeout(() => {
				setIsTyping(false);
			}, 3000);
		}
	}, [isTyping]);
	return (
		<div
			className='flex px-1 justify-between cursor-pointer'
			onClick={() => console.log(user)}>
			<div className='flex gap-4 justify-center'>
				<div className='flex flex-col justify-center'>
					<img
						className='w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500'
						src={user.image ? user.image : '/default-avatar.jpg/'}
						alt='Bordered avatar'
					/>
				</div>
				<div className='flex flex-col justify-center'>
					<div>{user.firstName}</div>
				</div>
				<div className=' flex justify-center items-center'>
					<BeatLoader color='#36d7b7' size={8} loading={isTyping} />
				</div>
			</div>
		</div>
	);
}

export { setIsTypingFunction as setIsTyping };
export { isTypingState as isTyping };
export default ChatPageUser;
