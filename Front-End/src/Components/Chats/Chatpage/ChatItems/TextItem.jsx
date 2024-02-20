import React from 'react';
import ChatItemBottomDetails from './ChatItemBottomDetails';

function TextItem({ chatItem }) {
	if (chatItem.from === 'self') {
		return (
			<div className=' flex justify-end px-3 py-2'>
				<div className='max-w-[80%] bg-themChat1 text-themeText1 p-2 rounded-lg'>
					<div className=' text-lg pe-2'>{chatItem.message}</div>
					<ChatItemBottomDetails chatItem={chatItem} />
				</div>
			</div>
		);
	} else {
		return (
			<div className='px-3 py-2'>
				<div className=' w-fit max-w-[70%] bg-themChat2 text-themeText1 p-2 rounded-lg'>
					<div className=' text-lg pe-2'>{chatItem.message}</div>
					<div className='text-xs flex justify-end items-end gap-2 text-themeText2'>
						{chatItem.time}
					</div>
				</div>
			</div>
		);
	}
}

export default TextItem;
