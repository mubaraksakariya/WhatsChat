import React, { useEffect, useState } from 'react';
import ChatItemBottomDetails from './ChatItemBottomDetails';
import { useAuth } from '../../../../Contexts/AuthContext';
import { dataURLtoBlob } from '../../../../HelperApi/FileConversions';

function AudioItem({ chatItem }) {
	const [audioUrl, setAudioUrl] = useState(null);
	const { loggedInUser } = useAuth();

	useEffect(() => {
		const blob = dataURLtoBlob(chatItem.audio);
		setAudioUrl(URL.createObjectURL(blob));
	}, [chatItem]);

	// if the message is created by the user, print on the right side of the screen
	if (chatItem.from === loggedInUser.email) {
		return (
			<div className='flex justify-end px-3 py-2'>
				<div className='max-w-[80%] min-w-[70%] bg-themChat1 text-themeText1 p-2 rounded-lg'>
					{audioUrl && (
						<audio controls className='w-full'>
							<source src={audioUrl} type='audio/mp3' />
							Your browser does not support the audio tag.
						</audio>
					)}
					<ChatItemBottomDetails chatItem={chatItem} />
				</div>
			</div>
		);
	} else {
		return (
			<div className='px-3 py-2'>
				<div className='w-fit max-w-[70%] bg-themChat2 text-themeText1 p-2 rounded-lg'>
					{audioUrl && (
						<audio controls className='w-full'>
							<source src={audioUrl} type='audio/mp3' />
							Your browser does not support the audio tag.
						</audio>
					)}
				</div>
				<div className='text-xs flex justify-end items-end gap-2 text-themeText2'>
					{chatItem.time}
				</div>
			</div>
		);
	}
}

export default AudioItem;
