import React, { useEffect, useState } from 'react';
import ChatItemBottomDetails from './ChatItemBottomDetails';
import { useAuth } from '../../../../Contexts/AuthContext';
import { dataURLtoBlob } from '../../../../HelperApi/FileConversions';

function ImageItem({ chatItem }) {
	const [imageBlob, setImageBlob] = useState();
	const { loggedInUser } = useAuth();
	useEffect(() => {
		const blob = dataURLtoBlob(chatItem.image.image);
		setImageBlob(blob);
	}, [chatItem]);

	// if the message is created by the user, print on the right side of the screen
	if (chatItem.from === loggedInUser.email) {
		return (
			<div className=' flex justify-end px-3 py-2'>
				<div className='max-w-[80%] bg-themChat1 text-themeText1 p-2 rounded-lg'>
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
				<div className=' w-fit max-w-[70%] bg-themChat2 text-themeText1 p-2 rounded-lg'>
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
