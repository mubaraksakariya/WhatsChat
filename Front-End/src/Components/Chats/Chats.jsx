import React, { useEffect, useState } from 'react';
import './Chats.css';
import Chat from './Chat';
import NewChatButton from './NewChatButton';
import { useNavigate } from 'react-router-dom';

function Chats() {
	const [db, setDB] = useState(null);
	const [contacts, setContacts] = useState([]);
	const [newContact, setNewContact] = useState({ name: '', email: '' });
	const navigate = useNavigate();

	const setSelectedChat = (user) => {
		console.log(user);
		navigate('/chat/', { state: { user } });
	};
	const users = [
		{
			id: 1,
			firstName: 'user 1',
			image: '/default-avatar.jpg/',
			lastMessage: 'message',
			lastSeen: '10:10 pm',
			unread: true,
		},
		{
			id: 2,
			firstName: 'user 1',
			image: '/default-avatar.jpg/',
			lastMessage: 'message',
			lastSeen: '10:10 pm',
			unread: true,
		},
		{
			id: 3,
			firstName: 'user 1',
			image: '/default-avatar.jpg/',
			lastMessage: 'message',
			lastSeen: '10:10 pm',
			unread: true,
		},
		{
			id: 4,
			firstName: 'user 1',
			image: '/default-avatar.jpg/',
			lastMessage: 'message',
			lastSeen: '10:10 pm',
			unread: true,
		},
		{
			id: 5,
			firstName: 'user 1',
			image: '/default-avatar.jpg/',
			lastMessage: 'message',
			lastSeen: '10:10 pm',
			unread: true,
		},
		{
			id: 6,
			firstName: 'user 1',
			image: '/default-avatar.jpg/',
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
