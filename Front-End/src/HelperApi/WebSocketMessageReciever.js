import { setIsTyping } from '../Components/Chats/Chatpage/ChatPageUser';
import { socket } from '../Contexts/WebsocketContext';
import { addMessage, updateStatus } from '../HelperApi/MessageApi';
import { chatItem, setChatItem } from '../Pages/User/ChatPage';

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

// Function to convert base64 string to Blob object
function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
	const byteCharacters = atob(b64Data);
	const byteArrays = [];
	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);
		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}
	const blob = new Blob(byteArrays, { type: contentType });
	return blob;
}

export { manageIncomingMessage };
