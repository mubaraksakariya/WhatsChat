import { setIsTyping } from '../Components/Chats/Chatpage/ChatPageUser';
import { socket } from '../Contexts/WebsocketContext';
import { addMessage, deleteMessage, updateStatus } from './MessageApi';
import { chatItem, setChatItem } from '../Pages/User/ChatPage';
import {
	changeCallState,
	iceRecieve,
	receiveAnswer,
	rejectCall,
	startRinging,
} from '../Contexts/VideoCallContext';
import { addContact } from './ContactApi';
import { refreshChatFromChats } from '../Components/Chats/Chats';

// distribute incoming message
const manageIncomingMessage = async (message) => {
	if (message.type === 'typing') {
		try {
			setIsTyping(message);
		} catch (error) {}
	}
	if (
		message.type === 'text' ||
		message.type === 'attachment' ||
		message.type === 'image' ||
		message.type === 'audio'
	) {
		const savedMessage = await addMessage(message);
		try {
			await setChatItem(savedMessage);
		} catch (error) {
			//if the messager is not saved on the receiver side
			// create a contact
			const contact = {
				first_name: savedMessage.from,
				last_name: savedMessage.from,
				email: savedMessage.from,
			};
			await addContact(contact);
			refreshChatFromChats();
			// await setChatItem(savedMessage);
		}
		// send unknoledgement back the sender
		const acknowledgement = {
			type: 'acknowledgement',
			id: savedMessage.id,
			acknowledgement_id: savedMessage.acknowledgement_id,
			status: 'received',
			to: savedMessage.from,
		};
		socket.forwardToWebSocket(acknowledgement);
	}
	if (message.type === 'video-call' || message.type === 'audio-call') {
		// incoming call, receives an offer
		if (message.status === 'offer') {
			await startRinging(message);
			const callReached = {
				type: message.type,
				status: 'reached',
				to: message.from,
				time: new Date().toLocaleString(),
			};
			socket.forwardToWebSocket(callReached);
		}

		// aknowledgment message that other device is being rung
		if (message.status === 'reached') {
			changeCallState('ringing');
		}
		if (message.status === 'answer') {
			receiveAnswer(message);
		}
		if (message.status === 'icecandidate') {
			iceRecieve(message);
		}
		if (message.status === 'end-call') {
			rejectCall();
		}
	}

	if (message.type === 'acknowledgement') {
		updateMessageStatus(message);
	}
	if (message.type === 'delete') {
		// console.log(message);
		try {
			const deletedMessage = await deleteMessage(message.id);
			// console.log('Message deleted:', deletedMessage);
			const updatedChatItem = chatItem.map((item, index) => {
				if (item.id === message.id) {
					return {
						...item,
						is_deleted: true,
					};
				}
				return item;
			});
			// Assuming setChatItem is your state update function
			setChatItem(updatedChatItem);
		} catch (error) {
			console.error('Error deleting message:', error);
		}
	}
};

// update the status to be read
const updateMessageStatus = (message) => {
	const messageId = message.acknowledgement_id;
	const status = message.status;
	const acknowledgement_id = message.id;
	// in messageApi
	updateStatus(messageId, status, acknowledgement_id);
	const messageIndex = chatItem.findIndex(
		(message) => message.id === messageId
	);
	if (messageIndex !== -1) {
		// Create a copy of the chatItem array
		const updatedChatItem = [...chatItem];

		// Update the status of the message
		updatedChatItem[messageIndex].status = status;
		// update the id of the message the other user is saved on
		updatedChatItem[messageIndex].acknowledgement_id = acknowledgement_id;

		// Set the updated chatItem array as the new state
		setChatItem(updatedChatItem);
	}
};

// update the message to be seen
const updateStatusToSeen = async (message) => {
	// console.log('sending seen acknoledgment');
	// console.log(message);
	const updatedMessage = await updateStatus(message.id, 'seen');

	const acknowledgement = {
		type: 'acknowledgement',
		acknowledgement_id: message.acknowledgement_id,
		status: 'seen',
		to: message.from,
		id: updatedMessage.id,
	};
	socket.forwardToWebSocket(acknowledgement);
};
const retrySendingMessage = (message) => {
	socket.forwardToWebSocket(message);
};

const deleteMessageForEveryone = (message) => {
	const messageToDelete = {
		...message,
		type: 'delete',
	};
	// console.log(messageToDelete);
	socket.forwardToWebSocket(messageToDelete);
};

export {
	manageIncomingMessage,
	updateMessageStatus,
	updateStatusToSeen,
	retrySendingMessage,
	deleteMessageForEveryone,
};
