import { setIsTyping } from '../Components/Chats/Chatpage/ChatPageUser';
import { socket } from '../Contexts/WebsocketContext';
import { addMessage, updateStatus } from './MessageApi';
import { chatItem, setChatItem } from '../Pages/User/ChatPage';

// distribute incoming message
const manageIncomingMessage = (message) => {
	if (message.type === 'typing') {
		setIsTyping(true);
	}
	if (
		message.type === 'text' ||
		message.type === 'attachment' ||
		message.type === 'image' ||
		message.type === 'audio'
	) {
		addMessage(message);
		setChatItem((old) => [...old, message]);
		const acknowledgement = {
			type: 'acknowledgement',
			acknowledgement_id: message.acknowledgement_id,
			status: 'received',
			to: message.from,
		};
		socket.forwardToWebSocket(acknowledgement);
	}
	// if (message.type === 'audio') {
	// 	console.log(message);
	// }
	if (message.type === 'acknowledgement') {
		updateMessageStatus(message);
	}
};

// update the status to be read
const updateMessageStatus = (message) => {
	const messageId = message.acknowledgement_id;
	const status = message.status;
	// in messageApi
	updateStatus(messageId, status);
	const messageIndex = chatItem.findIndex(
		(message) => message.id === messageId
	);
	if (messageIndex !== -1) {
		// Create a copy of the chatItem array
		const updatedChatItem = [...chatItem];

		// Update the status of the message
		updatedChatItem[messageIndex].status = status;

		// Set the updated chatItem array as the new state
		setChatItem(updatedChatItem);
	}
};

// update the message to be seen
const updateStatusToSeen = (message) => {
	const acknowledgement = {
		type: 'acknowledgement',
		acknowledgement_id: message.acknowledgement_id,
		status: 'seen',
		to: message.from,
	};
	socket.forwardToWebSocket(acknowledgement);
	updateStatus(message.id, 'seen');
};
const retrySendingMessage = (message) => {
	console.log(message);
};
export {
	manageIncomingMessage,
	updateMessageStatus,
	updateStatusToSeen,
	retrySendingMessage,
};
