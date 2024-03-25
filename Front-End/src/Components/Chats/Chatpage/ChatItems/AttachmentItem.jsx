import React, { useEffect, useState } from 'react';
import ChatItemBottomDetails from './ChatItemBottomDetails';
import { useAuth } from '../../../../Contexts/AuthContext';
import { dataURLtoBlob } from '../../../../HelperApi/FileConversions';
import { updateStatusToSeen } from '../../../../HelperApi/WebSocketMessageHelper';
import DropDownMenu from './DropDown/DropDownMenu';
import DropDownToggler from './DropDown/DropDownToggler';

function AttachmentItem({ chatItem }) {
	const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(false);
	const [isDropDown, setIsDropDown] = useState(false);
	const { loggedInUser } = useAuth();

	useEffect(() => {
		if (
			chatItem.status !== 'seen' &&
			chatItem.from !== loggedInUser.email
		) {
			updateStatusToSeen(chatItem);
		}
	}, []);
	const downloadAttachment = (e) => {
		e.preventDefault();
		const blob = dataURLtoBlob(chatItem.attachment.data);
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = chatItem.attachment.filename;
		document.body.appendChild(a);
		a.click();
		URL.revokeObjectURL(url);
		document.body.removeChild(a);
	};
	const toggleMenuButtonApprearance = () => {
		setIsMenuButtonVisible((old) => !old);
		setIsDropDown(false);
	};

	if (loggedInUser && chatItem.from === loggedInUser.email) {
		return (
			<div
				className='flex justify-end px-3 py-2'
				title={chatItem.attachment.filename}>
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
								chatItem={chatItem}
								isDropDown={isDropDown}
							/>
						</div>
					)}
					<div className='text-center bg-themeBlueSecondary rounded-full py-3'>
						<a
							href='#'
							onClick={downloadAttachment}
							className='cursor-pointer truncate max-w-[80%] inline-block'
							title={chatItem.attachment.filename} // Add title attribute for tooltip
						>
							{chatItem.attachment.filename}
						</a>
					</div>

					<ChatItemBottomDetails chatItem={chatItem} />
				</div>
			</div>
		);
	} else {
		return (
			<div
				className='flex px-3 py-2'
				title={chatItem.attachment.filename}>
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
								chatItem={chatItem}
								isDropDown={isDropDown}
							/>
						</div>
					)}
					<div className='text-center bg-themeBlueSecondary rounded-full py-3'>
						<a
							href='#'
							onClick={downloadAttachment}
							className='cursor-pointer truncate max-w-[80%] inline-block'
							title={chatItem.attachment.filename} // Add title attribute for tooltip
						>
							{chatItem.attachment.filename}
						</a>
					</div>
				</div>
			</div>
		);
	}
}

export default AttachmentItem;
