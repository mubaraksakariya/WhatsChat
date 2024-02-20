import React, { useEffect, useState } from 'react';
import NewChatNavBar from '../../Components/Chats/Newchat/NewChatNavBar';
import NewContactButton from '../../Components/Chats/Newchat/NewContactButton';
import { useNavigate } from 'react-router-dom';
import Contact from '../../Components/Contacts/Contact';
import { getAllContacts } from '../../HelperApi/ContactApi';

function NewChat() {
	const navigate = useNavigate();
	const [allContacts, setAllContacts] = useState([]);
	const [selectContact, setSelectedContact] = useState(null);
	const createNewContact = () => {
		navigate('/new-contact/');
	};

	const fetchContacts = async () => {
		try {
			const contacts = await getAllContacts();
			setAllContacts(contacts);
		} catch (error) {
			console.error('Error fetching contacts:', error);
		}
	};

	useEffect(() => {
		fetchContacts();
	}, []);
	useEffect(() => {
		console.log(selectContact);
	}, [selectContact]);

	return (
		<div className='w-full min-h-[100dvh] text-warmGray-300'>
			<NewChatNavBar />
			<div>
				<NewContactButton onClick={createNewContact} />
			</div>
			{/* Render the contacts in your JSX */}
			<div>
				{allContacts.map((contact) => (
					<div key={contact.id}>
						<Contact
							contact={contact}
							setSelectedContact={setSelectedContact}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default NewChat;
