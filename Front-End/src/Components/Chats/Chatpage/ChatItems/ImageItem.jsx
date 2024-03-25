import React, { useEffect, useState } from 'react';
import ChatItemBottomDetails from './ChatItemBottomDetails';
import { useAuth } from '../../../../Contexts/AuthContext';
import { dataURLtoBlob } from '../../../../HelperApi/FileConversions';
import { updateStatusToSeen } from '../../../../HelperApi/WebSocketMessageHelper';
import DropDownMenu from './DropDown/DropDownMenu';
import DropDownToggler from './DropDown/DropDownToggler';

function ImageItem({ chatItem }) {
	const [imageBlob, setImageBlob] = useState();
	const { loggedInUser } = useAuth();
	const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(false);
	const [isDropDown, setIsDropDown] = useState(false);

	useEffect(() => {
		const blob = dataURLtoBlob(chatItem.image.image);
		setImageBlob(blob);
		if (
			chatItem.status !== 'seen' &&
			chatItem.from !== loggedInUser.email
		) {
			updateStatusToSeen(chatItem);
		}
	}, [chatItem]);

	const toggleMenuButtonApprearance = () => {
		setIsMenuButtonVisible((old) => !old);
		setIsDropDown(false);
	};

	// if the message is created by the user, print on the right side of the screen
	if (loggedInUser && chatItem.from === loggedInUser.email) {
		return (
			<div className=' flex justify-end px-3 py-2'>
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

					{imageBlob && (
						<img
							src={URL.createObjectURL(imageBlob)}
							alt=''
							className=' mb-2'
						/>
					)}
					<div>{chatItem.image.caption}</div>
					<ChatItemBottomDetails chatItem={chatItem} />
				</div>
			</div>
		);
	}
	// if the message is received from other users, print on the left side of the screen
	else {
		return (
			<div className='px-3 py-2'>
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

					{imageBlob && (
						<img
							src={URL.createObjectURL(imageBlob)}
							alt=''
							className=' mb-2'
						/>
					)}
					<div>{chatItem.image.caption}</div>
					<div className='text-xs flex justify-end items-end gap-2 text-themeText2'>
						{chatItem.time}
					</div>
				</div>
			</div>
		);
	}
}

export default ImageItem;
