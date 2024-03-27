import React, { useEffect, useState } from 'react';
import ChatItemBottomDetails from './ChatItemBottomDetails';
import { useAuth } from '../../../../Contexts/AuthContext';
import { dataURLtoBlob } from '../../../../HelperApi/FileConversions';
import { updateStatusToSeen } from '../../../../HelperApi/WebSocketMessageHelper';
import DropDownMenu from './DropDown/DropDownMenu';
import DropDownToggler from './DropDown/DropDownToggler';
import DeletedChatItem from '../DeletedChatItem';

function AttachmentItem({ chatItem }) {
	const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(false);
	const [isDropDown, setIsDropDown] = useState(false);
	const { loggedInUser } = useAuth();
	const [message, setMessage] = useState(chatItem);

	useEffect(() => {
		if (
			message &&
			message.status !== 'seen' &&
			message.from !== loggedInUser.email
		) {
			updateStatusToSeen(message);
		}
		setMessage(chatItem);
	}, [chatItem]);
	const downloadAttachment = (e) => {
		e.preventDefault();
		const blob = dataURLtoBlob(message.attachment.data);
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = message.attachment.filename;
		document.body.appendChild(a);
		a.click();
		URL.revokeObjectURL(url);
		document.body.removeChild(a);
	};
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
			<div
				className='flex justify-end px-3 py-2'
				title={message.attachment.filename}>
				<div
					className='max-w-[80%] min-w-[50%] bg-themChat1 text-themeText1 p-2 rounded-lg relative'
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
					<div className='text-center bg-themeBlueSecondary rounded-full py-3'>
						<a
							href='#'
							onClick={downloadAttachment}
							className='cursor-pointer truncate max-w-[80%] inline-block'
							title={message.attachment.filename} // Add title attribute for tooltip
						>
							{message.attachment.filename}
						</a>
					</div>

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
			<div className='flex px-3 py-2' title={message.attachment.filename}>
				<div
					className='max-w-[80%] min-w-[50%] bg-themChat1 text-themeText1 p-2 rounded-lg relative'
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
					<div className='text-center bg-themeBlueSecondary rounded-full py-3'>
						<a
							href='#'
							onClick={downloadAttachment}
							className='cursor-pointer truncate max-w-[80%] inline-block'
							title={message.attachment.filename} // Add title attribute for tooltip
						>
							{message.attachment.filename}
						</a>
					</div>
				</div>
			</div>
		);
	} else return <DeletedChatItem message={message} />;
}

export default AttachmentItem;
