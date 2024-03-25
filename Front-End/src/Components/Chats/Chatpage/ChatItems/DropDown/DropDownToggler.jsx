import React, { useState } from 'react';

function DropDownToggler({ setIsDropDown }) {
	const toggleMenu = () => {
		setIsDropDown((old) => !old);
	};

	return (
		<div className=' absolute right-0 top-1 z-10'>
			<span
				onClick={toggleMenu}
				className='inline-flex items-center p-2'
				type='button'>
				<svg
					className='w-5 h-3 cursor-pointer text-themeText1'
					aria-hidden='true'
					xmlns='http://www.w3.org/2000/svg'
					fill='currentColor'
					viewBox='0 0 4 15'>
					<path d='M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z' />
				</svg>
			</span>
		</div>
	);
}

export default DropDownToggler;
