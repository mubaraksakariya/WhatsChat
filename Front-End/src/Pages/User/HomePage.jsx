import React, { useState } from 'react';
import './HomePage.css';
import TopNavBar from '../../Components/TopNavBar';
import NavBar from '../../Components/Chats/NavBar';
import Chats from '../../Components/Chats/Chats';
import Updates from '../../Components/Updates/Updates';
import Calls from '../../Components/Calls/Calls';
function HomePage() {
	const [selected, setSelected] = useState('chats');

	return (
		<div className='w-full min-h-[100dvh] text-warmGray-300 relative'>
			<div className=' bg-themeBlueSecondary'>
				<TopNavBar />
				<NavBar setSelected={setSelected} selected={selected} />
			</div>
			{selected === 'chats' && <Chats />}
			{selected === 'updates' && <Updates />}
			{selected === 'calls' && <Calls />}
		</div>
	);
}

export default HomePage;
