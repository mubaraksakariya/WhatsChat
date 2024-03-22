import React from 'react';

function Contact({ contact, setSelectedContact }) {
	return (
		<div
			className='flex px-5 py-3 justify-between cursor-pointer'
			onClick={() => setSelectedContact(contact)}>
			<div className='flex gap-4 justify-center'>
				<div className='flex flex-col justify-center'>
					<img
						className='w-12 h-12 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500'
						src={
							contact.image
								? contact.image
								: './default-avatar.jpg'
						}
						alt='Bordered avatar'
					/>
				</div>
				<div className='flex flex-col justify-center'>
					<div>{contact.first_name}</div>
					{/* <div>{user.lastMessage}</div> */}
				</div>
			</div>
		</div>
	);
}

export default Contact;
