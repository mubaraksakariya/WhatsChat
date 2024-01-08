import React from 'react';

function ChatItem({ chatItem }) {
	if (chatItem.from === 'self') {
		return (
			<div className=' flex justify-end px-3 py-2'>
				<div className='max-w-[80%] bg-themChat1 text-themeText1 p-2 rounded-lg'>
					<div className=' text-lg pe-2'>{chatItem.message}</div>
					<div className='text-xs flex justify-end items-end gap-2 text-themeText2'>
						{chatItem.time}
						{chatItem.status === 'send' && (
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='w-5 h-5'>
								<path
									fillRule='evenodd'
									d='M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z'
									clipRule='evenodd'
								/>
							</svg>
						)}
						{chatItem.status === 'received' && (
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='w-5 h-5'>
								<path
									fillRule='evenodd'
									d='M15.28 9.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25ZM6.03 5.22l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L8.69 10 4.97 6.28a.75.75 0 0 1 1.06-1.06Z'
									clipRule='evenodd'
								/>
							</svg>
						)}
						{chatItem.status === 'read' && (
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='w-5 h-5 text-blue-600'>
								<path
									fillRule='evenodd'
									d='M15.28 9.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25ZM6.03 5.22l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L8.69 10 4.97 6.28a.75.75 0 0 1 1.06-1.06Z'
									clipRule='evenodd'
								/>
							</svg>
						)}
					</div>
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

export default ChatItem;
