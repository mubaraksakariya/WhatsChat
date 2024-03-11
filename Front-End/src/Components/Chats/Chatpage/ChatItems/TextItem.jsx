import React, { useEffect } from 'react';
import ChatItemBottomDetails from './ChatItemBottomDetails';
import { useAuth } from '../../../../Contexts/AuthContext';

function TextItem({ chatItem }) {
	const { loggedInUser } = useAuth();
	// useEffect(() => {
	// 	console.log(loggedInUser);
	// }, []);
	if (loggedInUser && chatItem.from === loggedInUser.email) {
		return (
			<div className=' flex justify-end px-3 py-2'>
				<div className='max-w-[80%] bg-themChat1 text-themeText1 p-2 rounded-lg'>
					<div className=' text-lg pe-2'>{chatItem.text}</div>
					<ChatItemBottomDetails chatItem={chatItem} />
				</div>
			</div>
		);
	} else {
		return (
			<div className='px-3 py-2'>
				<div className=' w-fit max-w-[70%] bg-themChat2 text-themeText1 p-2 rounded-lg'>
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
