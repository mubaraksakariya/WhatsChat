import React, { useState } from 'react';
import './NavBar.css';
function NavBar({ setSelected, selected }) {
	return (
		<div className='grid grid-cols-3 gap-4'>
			<div
				className={`max-w-full pb-3 text-center cursor-pointer ${
					selected === 'chats'
						? 'border-b-4 text-green-500 border-green-500'
						: ''
				}`}
				onClick={() => setSelected('chats')}>
				Chats
			</div>
			<div
				className={`max-w-full pb-3 text-center cursor-pointer ${
					selected === 'updates'
						? 'border-b-4 text-green-500 border-green-500'
						: ''
				}`}
				onClick={() => setSelected('updates')}>
				Updates
			</div>
			<div
				className={`max-w-full pb-3 text-center cursor-pointer ${
					selected === 'calls'
						? 'border-b-4 text-green-500 border-green-500'
						: ''
				}`}
				onClick={() => setSelected('calls')}>
				Calls
			</div>
		</div>
	);
}

export default NavBar;
