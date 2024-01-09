import React, { useEffect } from 'react';
import ChatPageNav from '../../Components/Chats/Chatpage/ChatPageNav';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatItem from '../../Components/Chats/Chatpage/ChatItem';
import ChatInput from '../../Components/Chats/Chatpage/ChatInput';

function ChatPage() {
	const location = useLocation();
	const user = location.state.user;
	const navigate = useNavigate();
	useEffect(() => {
		if (!user) navigate('');
	}, []);
	const chatItem = [
		{
			message:
				'hey sdfhl a dsf hl dsfsd pfg fg df aa df ad a adsf dfsdfd a dasdfadsf ad',
			from: 'self',
			time: '10:10',
			status: 'read',
		},
		{
			message: 'hi',
			from: 'user',
			time: '10:11',
			status: 'send',
		},
	];
	return (
		<div className=' relative flex flex-col min-h-[100dvh]'>
			<div>
				<ChatPageNav user={user} />
			</div>
			<div className='flex-1  max-h-[80%]'>
				{chatItem.map((item) => {
					return <ChatItem chatItem={item} key={item.time} />;
				})}
			</div>
			<div className='flex-none p-2'>
				<ChatInput user={user} />
			</div>
		</div>
	);
}

export default ChatPage;
