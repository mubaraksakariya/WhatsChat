import React, { useEffect, useRef, useState } from 'react';
import ChatPageNav from '../../Components/Chats/Chatpage/ChatPageNav';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatInput from '../../Components/Chats/Chatpage/ChatInput';
import ChatScrollableDisplay from '../../Components/Chats/Chatpage/ScrollablePart/ChatScrollableDisplay';
import Confirmation from '../../Contexts/Helpers/Confirmation';

let setChatItemFunction;
let chatItemState;

function ChatPage() {
	const [chatItem, setChatItem] = useState([]);
	const location = useLocation();
	const user = location.state.user;
	setChatItemFunction = setChatItem;
	chatItemState = chatItem;
	return (
		<div className='relative flex flex-col min-h-[100dvh] max-h-[100dvh] min-w-[100%] overflow-hidden'>
			<div>
				<ChatPageNav user={user} />
			</div>
			{/* all chats comes here, srollable container */}
			<ChatScrollableDisplay
				chatItem={chatItem}
				setChatItem={setChatItem}
				user={user}
			/>

			<div className='flex-none p-2'>
				<ChatInput user={user} setChatItem={setChatItem} />
			</div>
		</div>
	);
}

export { setChatItemFunction as setChatItem };
export { chatItemState as chatItem };
export default ChatPage;
