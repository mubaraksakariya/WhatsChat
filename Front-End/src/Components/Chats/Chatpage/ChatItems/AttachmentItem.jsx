import React from 'react';
import ChatItemBottomDetails from './ChatItemBottomDetails';
import { useAuth } from '../../../../Contexts/AuthContext';
import { dataURLtoBlob } from '../../../../HelperApi/FileConversions';

function AttachmentItem({ chatItem }) {
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

	const { loggedInUser } = useAuth();

	if (chatItem.from === loggedInUser.email) {
		return (
			<div
				className='flex justify-end px-3 py-2'
				title={chatItem.attachment.filename}>
				<div className='max-w-[80%] min-w-[50%] bg-themChat1 text-themeText1 p-2 rounded-lg'>
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
				<div className='max-w-[80%] min-w-[50%] bg-themChat1 text-themeText1 p-2 rounded-lg'>
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
