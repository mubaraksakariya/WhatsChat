import React, { useEffect, useState } from 'react';
import ChatItemBottomDetails from './ChatItemBottomDetails';
import { useAuth } from '../../../../Contexts/AuthContext';
import { dataURLtoBlob } from '../../../../HelperApi/FileConversions';
import { useWebSocket } from '../../../../Contexts/WebsocketContext';
import { updateStatusToSeen } from '../../../../HelperApi/WebSocketMessageHelper';
import DropDownMenu from './DropDown/DropDownMenu';
import DropDownToggler from './DropDown/DropDownToggler';
import DeletedChatItem from '../DeletedChatItem';

function AudioItem({ chatItem }) {
	const [audioUrl, setAudioUrl] = useState(null);
	const { loggedInUser } = useAuth();
	const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(false);
	const [isDropDown, setIsDropDown] = useState(false);
	const socket = useWebSocket();
	const [message, setMessage] = useState(chatItem);

	useEffect(() => {
		const blob = dataURLtoBlob(message.audio);
		setAudioUrl(URL.createObjectURL(blob));
		// to update the message status to 'seen'
		if (
			message &&
			message.status !== 'seen' &&
			message.from !== loggedInUser.email
		) {
			updateStatusToSeen(message);
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

	if (
		loggedInUser &&
		message &&
		message.from === loggedInUser.email &&
		message.is_deleted !== true
	) {
		return (
			<div className='flex justify-end px-3 py-2'>
				<div
					className='max-w-[80%] min-w-[70%] bg-themChat1 text-themeText1 p-2 rounded-lg relative'
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
					{audioUrl && (
						<audio controls className='w-full  ps-2 pe-5'>
							<source src={audioUrl} type='audio/mp3' />
							Your browser does not support the audio tag.
						</audio>
					)}
					<ChatItemBottomDetails message={message} />
				</div>
			</div>
		);
	} else if (
		loggedInUser &&
		message &&
		message.from !== loggedInUser.email &&
		message.is_deleted !== true
	) {
		return (
			<div className='px-3 py-2'>
				<div
					className='max-w-[80%] bg-themChat2 text-themeText1 p-2 rounded-lg relative'
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
					{audioUrl && (
						<audio controls className='w-full ps-2 pe-5'>
							<source src={audioUrl} type='audio/mp3' />
							Your browser does not support the audio tag.
						</audio>
					)}
					<div className='text-xs flex justify-end items-end gap-2 text-themeText2 pt-2'>
						{message.time}
					</div>
				</div>
			</div>
		);
	} else return <DeletedChatItem message={message} />;
}

export default AudioItem;
