import React from 'react';
import NewChatNavBar from '../../Components/Chats/Newchat/NewChatNavBar';
import NewContactButton from '../../Components/Chats/Newchat/NewContactButton';
import { useNavigate } from 'react-router-dom';

function NewChat() {
	const navigate = useNavigate();
	const newContact = () => {
		navigate('/new-contact/');
	};
	return (
		<div className='w-full min-h-[100dvh] text-warmGray-300'>
			<NewChatNavBar />
			<div className=''>
				<NewContactButton onClick={newContact} />
			</div>
		</div>
	);
}

export default NewChat;
