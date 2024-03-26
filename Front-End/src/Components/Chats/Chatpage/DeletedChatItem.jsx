import React from 'react';
import { useAuth } from '../../../Contexts/AuthContext';

function DeletedChatItem({ message }) {
	const { loggedInUser } = useAuth();
	if (
		loggedInUser &&
		message.from === loggedInUser.email &&
		message.is_deleted == true
	)
		return (
			<div className='flex justify-end px-3 py-2 '>
				<div className=' w-fit max-w-[80%] bg-themChat2 text-themeText1 p-2 px-4 rounded-lg relative'>
					This message has been deleted
				</div>
			</div>
		);
	else if (
		loggedInUser &&
		message.from !== loggedInUser.email &&
		message.is_deleted == true
	)
		return (
			<div className='px-3 py-2 '>
				<div className=' w-fit max-w-[80%] bg-themChat2 text-themeText1 p-2 px-4 rounded-lg relative'>
					This message has been deleted
				</div>
			</div>
		);
}

export default DeletedChatItem;
