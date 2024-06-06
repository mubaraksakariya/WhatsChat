import React, { useEffect, useState } from 'react';
import ChatItemBottomDetails from './ChatItemBottomDetails';
import { useAuth } from '../../../../Contexts/AuthContext';
import {
	retrySendingMessage,
	updateStatusToSeen,
} from '../../../../HelperApi/WebSocketMessageHelper';
import DropDownMenu from './DropDown/DropDownMenu';
import DropDownToggler from './DropDown/DropDownToggler';
import DeletedChatItem from '../DeletedChatItem';

function TextItem({ chatItem }) {
	const { loggedInUser } = useAuth();
	const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(false);
	const [isDropDown, setIsDropDown] = useState(false);
	const [message, setMessage] = useState(chatItem);

	// to determine kind of message, if it is a send or received or deleted
	const isMessageDeleted = message?.is_deleted === true;
	const isSendMessage = message?.from === loggedInUser?.email;
	const isReceivedMessage = message?.from !== loggedInUser?.email;

	useEffect(() => {
		if (
			message &&
			message.status !== 'seen' &&
			message.from !== loggedInUser.email
		) {
			updateStatusToSeen(message);
		}
		if (
			message &&
			message.status === 'error' &&
			message.from == loggedInUser.email
		) {
			retrySendingMessage(message);
		}
		setMessage(chatItem);
	}, [chatItem]);
	const toggleDropDownMenu = () => {
		setIsDropDown((old) => !old);
		toggleMenuButtonApprearance();
	};
	const toggleMenuButtonApprearance = () => {
		setIsMenuButtonVisible((old) => !old);
		setIsDropDown(false);
	};

	if (isMessageDeleted) return <DeletedChatItem message={message} />;

	if (isSendMessage) {
		return (
			<div className='flex justify-end px-3 py-2 '>
				<div
					className='max-w-[80%] bg-themChat1 text-themeText1 p-2 rounded-lg relative'
					onMouseEnter={toggleMenuButtonApprearance}
					onMouseLeave={toggleMenuButtonApprearance}>
					{isMenuButtonVisible && (
						<DropDownToggler setIsDropDown={setIsDropDown} />
					)}
					{isDropDown && (
						<div className='absolute top-0 bottom-0 right-0  z-10 px-3 '>
							<DropDownMenu
								message={message}
								setMessage={setMessage}
								toggleDropDownMenu={toggleDropDownMenu}
								loggedInUser={loggedInUser}
							/>
						</div>
					)}
					<div className=' text-lg pe-5'>{message.text}</div>
					<ChatItemBottomDetails message={message} />
				</div>
			</div>
		);
	}

	if (isReceivedMessage) {
		return (
			<div className='px-3 py-2 '>
				<div
					className='w-fit max-w-[80%] bg-themChat2 text-themeText1 p-2 rounded-lg relative'
					onMouseEnter={toggleMenuButtonApprearance}
					onMouseLeave={toggleMenuButtonApprearance}>
					{isMenuButtonVisible && (
						<DropDownToggler setIsDropDown={setIsDropDown} />
					)}
					{isDropDown && (
						<div className='absolute top-0 bottom-0 left-0  z-10 px-3 '>
							<DropDownMenu
								message={message}
								setMessage={setMessage}
								toggleDropDownMenu={toggleDropDownMenu}
								loggedInUser={loggedInUser}
							/>
						</div>
					)}
					<div className=' text-lg pe-5'>{message.text}</div>
					<div className='text-xs flex justify-end items-end gap-2 text-themeText2'>
						{message.time}
					</div>
				</div>
			</div>
		);
	}
}

export default TextItem;
