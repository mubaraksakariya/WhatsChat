import React, { useEffect, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { useAxios } from '../../../Contexts/AxiosContext';
import { formatLastSeen } from '../../../HelperApi/MessageApi';

let setIsTypingFunction;
let isTypingState;

function ChatPageUser({ user }) {
	const [isTyping, setIsTyping] = useState(false);
	const [profile, setProfile] = useState();
	const [isOnline, setIsonline] = useState(false);
	const axios = useAxios();

	setIsTypingFunction = (message) => {
		if (message.from === profile.email) {
			setIsTyping(true);
			setTimeout(() => {
				setIsTyping(false);
			}, 3000);
		}
	};
	isTypingState = isTyping;

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axios.get(`user/${user.email}`);
				if (response.data.result) {
					setProfile(response.data.user);
					setIsonline(response.data.is_online);
				} else manageUnknownUser();
			} catch (error) {
				console.error('Failed to fetch profile:', error);
			}
		};

		fetchProfile();

		const intervalId = setInterval(fetchProfile, 30000); // Fetch profile every 30 seconds

		return () => {
			clearInterval(intervalId);
		};
	}, [axios, user.id]);

	const manageUnknownUser = () => {
		setProfile(user);
		console.log('this user is not a WhatsChat user');
	};

	return (
		<div
			className='px-1 flex-1 flex justify-between'
			onClick={() => console.log(profile)}>
			<div className='flex gap-4 justify-center'>
				<div className='flex flex-col justify-center'>
					<img
						className='w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500'
						src={
							profile && profile.image
								? profile.image
								: '/default-avatar.jpg/'
						}
						alt='Bordered avatar'
					/>
				</div>
				<div className=' flex flex-col justify-center items-center'>
					{profile && profile.first_name}
				</div>
			</div>
			<div className=' absolute bottom-[45%] right-[35%]'>
				<BeatLoader color='#36d7b7' size={5} loading={isTyping} />
			</div>
			<div className=' absolute bottom-[10%] left-[22%]'>
				{isOnline
					? 'online'
					: profile &&
					  `Last seen  ${formatLastSeen(profile.last_seen)}`}
			</div>
		</div>
	);
}

export { setIsTypingFunction as setIsTyping };
export { isTypingState as isTyping };
export default ChatPageUser;
