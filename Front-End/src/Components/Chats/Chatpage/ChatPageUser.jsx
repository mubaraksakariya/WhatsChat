import React from 'react';

function ChatPageUser({ user }) {
	return (
		<div
			className='flex px-1 justify-between cursor-pointer'
			onClick={() => console.log(user)}>
			<div className='flex gap-4 justify-center'>
				<div className='flex flex-col justify-center'>
					<img
						className='w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500'
						src={user.image ? user.image : './default-avatar.jpg'}
						alt='Bordered avatar'
					/>
				</div>
				<div className='flex flex-col justify-center'>
					<div>{user.firstName}</div>
				</div>
			</div>
		</div>
	);
}

export default ChatPageUser;
