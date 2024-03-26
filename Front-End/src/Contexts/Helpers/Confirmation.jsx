import React from 'react';

function Confirmation({ message, onConfirm, onReject }) {
	return (
		<div className='absolute w-screen max-w-lg min-h-screen bg-themeBlueSecondary flex justify-center items-center bg-opacity-50'>
			<div className='bg-themeBlue rounded-[10px] p-5'>
				<div className='p-2 pb-6 text-themeText1'>{message}</div>
				<div className=' flex justify-center gap-2'>
					<button
						onClick={() => onConfirm()}
						type='button'
						className='text-themeText1 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>
						Yes
					</button>
					<button
						onClick={() => onReject()}
						type='button'
						className='text-themeText1 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>
						No
					</button>
				</div>
			</div>
		</div>
	);
}

export default Confirmation;
