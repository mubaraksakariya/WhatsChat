import React, { useEffect, useState } from 'react';
import './ChatInputButton.css';

function ChatMessageSendButton({ icon, onclick }) {
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		setAnimate(true); // Trigger animation on component mount
	}, []);
	return (
		<button
			className='mx-2 px-2 rounded-full bg-themeGreenButton1 hover:bg-themeGreenButton2 active:bg-themeGreenButton3 aspect-square'
			onClick={onclick}>
			{React.cloneElement(icon, {
				className: `w-6 h-6 ${animate ? 'zoomIn' : ''}`, // Apply zoomIn class conditionally
			})}
		</button>
	);
}

export default ChatMessageSendButton;
