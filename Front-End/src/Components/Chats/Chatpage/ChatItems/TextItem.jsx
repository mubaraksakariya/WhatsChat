import React, { useEffect, useState } from 'react';
import ChatItemBottomDetails from './ChatItemBottomDetails';
import { useAuth } from '../../../../Contexts/AuthContext';
import {
	retrySendingMessage,
	updateStatusToSeen,
} from '../../../../HelperApi/WebSocketMessageHelper';
import DropDownMenu from './DropDown/DropDownMenu';
import DropDownToggler from './DropDown/DropDownToggler';

function TextItem({ chatItem }) {
	const { loggedInUser } = useAuth();
	const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(false);
	const [isDropDown, setIsDropDown] = useState(false);

	useEffect(() => {
		if (
			chatItem.status !== 'seen' &&
			chatItem.from !== loggedInUser.email
		) {
			updateStatusToSeen(chatItem);
		}
		if (
			chatItem.status === 'error' &&
			chatItem.from == loggedInUser.email
		) {
			retrySendingMessage(chatItem);
		}
	}, []);

	const toggleMenuButtonApprearance = () => {
		setIsMenuButtonVisible((old) => !old);
		setIsDropDown(false);
	};

	if (loggedInUser && chatItem.from === loggedInUser.email) {
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
								chatItem={chatItem}
								isDropDown={isDropDown}
							/>
						</div>
					)}
					<div className=' text-lg pe-2'>{chatItem.text}</div>
					<ChatItemBottomDetails chatItem={chatItem} />
				</div>
			</div>
		);
	} else {
		return (
			<div className='px-3 py-2 '>
				<div
					className=' w-fit max-w-[80%] bg-themChat2 text-themeText1 p-2 rounded-lg relative'
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
					<div className=' text-lg pe-2'>{chatItem.text}</div>
					<div className='text-xs flex justify-end items-end gap-2 text-themeText2'>
						{chatItem.time}
					</div>
				</div>
			</div>
		);
	}
}

export default TextItem;
