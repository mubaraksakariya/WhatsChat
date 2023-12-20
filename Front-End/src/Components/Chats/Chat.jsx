import React from 'react';

function Chat({ user, setSelectedChat }) {
	return (
		<div
			className='flex px-5 py-5 justify-between cursor-pointer'
			onClick={() => setSelectedChat(user.id)}>
			<div className='flex gap-4'>
				<div className='flex flex-col justify-center'>
					<img
						className='w-12 h-12 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500'
						src={user.image}
						alt='Bordered avatar'
					/>
				</div>
				<div>
					<div>{user.name}</div>
					<div>{user.lastMessage}</div>
				</div>
			</div>
			<div>
				<div>{user.lastSeen}</div>
				<div>{user.unread && '*'}</div>
			</div>
		</div>
	);
}

export default Chat;
