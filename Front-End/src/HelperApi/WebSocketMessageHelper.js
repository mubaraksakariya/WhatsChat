import { setIsTyping } from '../Components/Chats/Chatpage/ChatPageUser';
import { socket } from '../Contexts/WebsocketContext';
import { addMessage, deleteMessage, updateStatus } from './MessageApi';
import { chatItem, setChatItem } from '../Pages/User/ChatPage';
import {
	iceRecieve,
	receiveAnswer,
	startRinging,
} from '../Contexts/VideoCallContext';

// distribute incoming message
const manageIncomingMessage = async (message) => {
	if (message.type === 'typing') {
		setIsTyping(true);
	}
	if (
		message.type === 'text' ||
		message.type === 'attachment' ||
		message.type === 'image' ||
		message.type === 'audio'
	) {
		const savedMessage = await addMessage(message);
		// console.log(savedMessage);
		setChatItem((old) => [...old, savedMessage]);
		const acknowledgement = {
			type: 'acknowledgement',
			id: savedMessage.id,
			acknowledgement_id: savedMessage.acknowledgement_id,
			status: 'received',
			to: savedMessage.from,
		};
		socket.forwardToWebSocket(acknowledgement);
	}
	if (message.type === 'video-call') {
		if (message.status === 'offer') {
			// const offer = message.offer;
			// to acknoledge the other user
			const callReached = {
				type: 'video-call',
				status: 'reached',
				to: message.from,
				time: new Date().toLocaleString(),
			};
			socket.forwardToWebSocket(callReached);
			startRinging(message);
		}
		if (message.status === 'reached') {
			console.log('ringing');
		}
		if (message.status === 'answer') {
			receiveAnswer(message);
		}
		if (message.status === 'icecandidate') {
			iceRecieve(message);
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
