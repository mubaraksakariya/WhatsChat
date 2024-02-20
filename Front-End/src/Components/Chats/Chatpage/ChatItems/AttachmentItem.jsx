import React from 'react';
import ChatItemBottomDetails from './ChatItemBottomDetails';

function AttachmentItem({ chatItem }) {
	const file = chatItem.message[0];
	const manageDownload = (e) => {
		e.preventDefault();
		console.log(file);
	};

	// if the message is created by the user, print on the right side of the screen
	if (chatItem.from === 'self') {
		return (
			<div className='flex justify-end px-3 py-2'>
				<div className='max-w-[80%] min-w-[50%] bg-themChat1 text-themeText1 p-2 rounded-lg'>
					<div className=' text-center bg-themeBlueSecondary rounded-full py-3'>
						<a
							href={URL.createObjectURL(file)}
							className=' cursor-pointer'
							onClick={manageDownload}>
							{chatItem.message[0].name}
						</a>
					</div>
					<ChatItemBottomDetails chatItem={chatItem} />
				</div>
			</div>
		);
	} else {
		return (
			<div className='px-3 py-2'>
				<div className='w-fit max-w-[70%] bg-themChat2 text-themeText1 p-2 rounded-lg'>
					Attachment
				</div>
				<div className='text-xs flex justify-end items-end gap-2 text-themeText2'>
					{chatItem.time}
				</div>
			</div>
		);
	}
}

export default AttachmentItem;
