import React, { useState } from 'react';

function DropDownMenu({ chatItem, isDropDown }) {
	const manageAction = (action) => {
		console.log(chatItem);
	};

	return (
		<div className='min-h-full flex justify-center items-center mx-3'>
			<ul
				className='py-2 px-3 gap-2 bg-themeBlueSecondary rounded-[20px] text-sm text-themeText2 dark:text-gray-200 flex justify-center items-center'
				aria-labelledby='dropdownMenuIconButton'>
				<li>
					<span
						onClick={() => manageAction('delete')}
						className='block px-4 py-2 hover:text-themeError cursor-pointer'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-6 h-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
							/>
						</svg>
					</span>
				</li>
				<li>
					<span
						onClick={() => manageAction('forward')}
						className='block px-4 py-2 hover:text-white cursor-pointer'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-6 h-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3'
							/>
						</svg>
					</span>
				</li>
				<li>
					<span
						onClick={() => manageAction('resend')}
						className='block px-4 py-2 hover:text-themeGreen cursor-pointer'>
						Resend
					</span>
				</li>
				<li>
					<span
						onClick={() => manageAction('report')}
						href='#'
						className='block px-4 py-2 hover:text-white cursor-pointer'>
						Report
					</span>
				</li>
			</ul>
		</div>
	);
}

export default DropDownMenu;
