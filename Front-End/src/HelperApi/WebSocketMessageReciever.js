import { addMessage } from '../HelperApi/MessageApi';
import { setChatItem } from '../Pages/User/ChatPage';

const manageIncomingMessage = (message) => {
	if (message.type === 'typing') {
		console.log('user is typing now');
	}
	if (message.type === 'text') {
		console.log(message);
		addMessage(message);
		setChatItem((old) => [...old, message]);
	}
};

export { manageIncomingMessage };
