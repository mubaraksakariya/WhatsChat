import React, { useEffect, useRef, useState } from 'react';
import ChatPageNav from '../../Components/Chats/Chatpage/ChatPageNav';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatItem from '../../Components/Chats/Chatpage/ChatItem';
import ChatInput from '../../Components/Chats/Chatpage/ChatInput';
import { getAllMessages } from '../../HelperApi/MessageApi';

function ChatPage() {
	const location = useLocation();
	const user = location.state.user;
	const navigate = useNavigate();
	const [chatItem, setChatItem] = useState([]);
	const chatContainerRef = useRef(null);

	useEffect(() => {
		if (!user) navigate('');
		getAllMessages().then((allMessages) => {
			setChatItem((old) => [...allMessages]);
		});
	}, []);

	useEffect(() => {
		const chatContainer = chatContainerRef.current;
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
		}
	}, [chatItem]);

	return (
		<div className='relative flex flex-col min-h-[100dvh] max-h-[100dvh] min-w-[100%] overflow-hidden'>
			<div>
				<ChatPageNav user={user} />
			</div>
			<div
				className='flex-1 max-h-[80%] overflow-auto'
				ref={chatContainerRef}>
				{chatItem.map((item) => {
					return <ChatItem chatItem={item} key={item.id} />;
				})}
			</div>
			<div className='flex-none p-2'>
				<ChatInput user={user} setChatItem={setChatItem} />
			</div>
		</div>
	);
}

export default ChatPage;
