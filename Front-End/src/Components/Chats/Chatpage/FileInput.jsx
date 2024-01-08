import React, { useRef, useState } from 'react';

function FileInput({ setAttachment }) {
	const fileRef = useRef();
	const openFileInput = () => {
		fileRef.current.click();
	};
	const manageFileInput = () => {
		const selectedFiles = fileRef.current.files;
		setAttachment(Array.from(selectedFiles));
	};
	return (
		<>
			<input
				type='file'
				name=''
				id=''
				multiple
				hidden
				ref={fileRef}
				onChange={manageFileInput}
			/>
			<svg
				onClick={openFileInput}
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth={1.5}
				stroke='currentColor'
				className='w-6 h-6 cursor-pointer'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13'
				/>
			</svg>
		</>
	);
}

export default FileInput;
