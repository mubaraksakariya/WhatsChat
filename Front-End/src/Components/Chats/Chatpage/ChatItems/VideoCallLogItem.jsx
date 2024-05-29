import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../Contexts/AuthContext';
import AnsweredLog from './VideoCallLogItems/AnsweredLog';
import MissedCallLog from './VideoCallLogItems/MissedCallLog';
import { useVideoCall } from '../../../../Contexts/VideoCallContext';
import { useConfirmation } from '../../../../Contexts/ConfirmationContext';

const VideoCallLogItem = React.memo(({ chatItem }) => {
	const { loggedInUser } = useAuth();
	const [callLog, setCallLog] = useState(chatItem.log);
	const { startVideoCall } = useVideoCall();
	const { confirm } = useConfirmation();

	const returnCall = () => {
		let user =
			chatItem.from === loggedInUser.email
				? chatItem.log.to
				: chatItem.log.from;
		confirm(
			'Make a video call?',
			() => startVideoCall(user),
			() => {
				console.log('not to call');
			}
		);
	};

	const CallLogComponent = ({ log, returnCall }) => {
		switch (log.status) {
			case 'answered':
			case 'accepted':
				return <AnsweredLog callLog={log} returnCall={returnCall} />;
			case 'unattended':
			case 'missed':
			case 'calling':
			case 'ringing':
				return <MissedCallLog callLog={log} returnCall={returnCall} />;
			default:
				return null;
		}
	};

	if (!loggedInUser || !chatItem) {
		return null;
	}

	const isSender = chatItem.from === loggedInUser.email;

	return (
		<div className={`px-3 py-2 ${isSender ? 'flex justify-end' : ''}`}>
			<div className='min-w-[50%] max-w-[50%] bg-themChat1 text-themeText1 p-2 rounded-lg relative'>
				<CallLogComponent log={callLog} returnCall={returnCall} />
			</div>
		</div>
	);
});

export default VideoCallLogItem;
