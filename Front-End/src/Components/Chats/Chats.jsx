import React, { useEffect, useState } from 'react';
import './Chats.css';
import Chat from './Chat';
import NewChatButton from './NewChatButton';
import { useNavigate } from 'react-router-dom';

function Chats() {
	const [contacts, setContacts] = useState(null);
	const navigate = useNavigate();

	const setSelectedChat = (user) => {
		navigate('/chat/', { state: { user } });
	};
	useEffect(() => {
		const openDB = indexedDB.open('WhatsChatDb', 1);

		openDB.onerror = function (event) {
			console.error('Error opening database');
		};

		openDB.onsuccess = function (event) {
			const db = event.target.result;
			const transaction = db.transaction(['contacts'], 'readonly');
			const objectStore = transaction.objectStore('contacts');
			const getAllContactsRequest = objectStore.getAll();
			getAllContactsRequest.onsuccess = function (event) {
				const result = event.target.result;
				setContacts(result);
			};
			getAllContactsRequest.onerror = function (event) {
				console.error('Error fetching contacts:', event.target.error);
			};
		};
	}, []);

	return (
		<div className='chats-container'>
			{contacts &&
				contacts.map((user) => (
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
