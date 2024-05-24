import React, { useEffect, useState } from 'react';
import './Chats.css';
import Chat from './Chat';
import NewChatButton from './NewChatButton';
import { useNavigate } from 'react-router-dom';
import { getAllContacts } from '../../HelperApi/ContactApi';
let refreshChat = null;
function Chats() {
	const [contacts, setContacts] = useState(null);
	const navigate = useNavigate();

	const setSelectedChat = (user) => {
		navigate('/chat/', { state: { user } });
	};
	refreshChat = async () => {
		getAllContacts().then((response) => {
			setContacts(response);
		});
	};
	useEffect(() => {
		refreshChat();
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
export const refreshChatFromChats = () => {
	refreshChat();
};
export default Chats;
