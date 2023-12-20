import React, { useEffect, useState } from 'react';
import './Chats.css';
import Chat from './Chat';
import NewChatButton from './NewChatButton';

function Chats() {
	const [db, setDB] = useState(null);
	const [contacts, setContacts] = useState([]);
	const [newContact, setNewContact] = useState({ name: '', email: '' });

	const setSelectedChat = (chatId) => {
		console.log(chatId);
	};
	const users = [
		{
			id: 1,
			name: 'user 1',
			image: './aboutus1.jpg',
			lastMessage: 'message',
			lastSeen: '10:10 pm',
			unread: true,
		},
		{
			id: 2,
			name: 'user 1',
			image: './aboutus1.jpg',
			lastMessage: 'message',
			lastSeen: '10:10 pm',
			unread: true,
		},
		{
			id: 3,
			name: 'user 1',
			image: './aboutus1.jpg',
			lastMessage: 'message',
			lastSeen: '10:10 pm',
			unread: true,
		},
		{
			id: 4,
			name: 'user 1',
			image: './aboutus1.jpg',
			lastMessage: 'message',
			lastSeen: '10:10 pm',
			unread: true,
		},
		{
			id: 5,
			name: 'user 1',
			image: './aboutus1.jpg',
			lastMessage: 'message',
			lastSeen: '10:10 pm',
			unread: true,
		},
		{
			id: 6,
			name: 'user 1',
			image: './aboutus1.jpg',
			lastMessage: 'message',
			lastSeen: '10:10 pm',
			unread: true,
		},
	];

	return (
		<div className='chats-container'>
			{users.map((user) => (
				<Chat
					user={user}
					setSelectedChat={setSelectedChat}
					key={user.id}
				/>
			))}
			<div className=' absolute bottom-3 right-3'>
				<NewChatButton />
			</div>
		</div>
	);
}

export default Chats;
