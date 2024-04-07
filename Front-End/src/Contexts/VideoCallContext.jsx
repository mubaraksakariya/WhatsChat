import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import VideoCaller from './Helpers/videoCaller';
import { answerCall } from './Helpers/VideoCallHelper';
import { useAxios } from './AxiosContext';
import VideoCallRinger from './Helpers/VideoCallRinger';
import VideoCallMain from './Helpers/VideoCallMain';

const VideoCallContext = createContext();
let ringingTogler = null;
let answerReceiver = null;

export const VideoCallProvider = ({ children }) => {
	const configuration = {
		iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
	};
	let peerConnection = new RTCPeerConnection(configuration);

	const [isVidoCall, setIsVidoCall] = useState(false);
	const [isRinging, setIsRinging] = useState(false);
	const [isCallStarted, setIsCallStarted] = useState(false);
	const [localMediaStream, setLocalMediaStream] = useState(null);
	const [remoteMediaStream, setRemoteMediaStream] = useState(null);
	const [selectedDevice, setSelectedDevice] = useState(null);
	const [offer, setOffer] = useState(null);
	const [user, setUser] = useState(null);

	const { loggedInUser } = useAuth();
	const axios = useAxios();

	const startVideoCall = (user) => {
		setIsVidoCall(true);
		setUser(user);
	};
	const stopVideoCall = () => {
		setIsVidoCall(false);
	};
	const startRinging = (message) => {
		if (message.from && message.offer) {
			setOffer(message.offer);
			axios.get(`user/${message.from}`).then((response) => {
				const user = response.data.user;
				setUser(user);
				setIsRinging(true);
			});
		} else {
			console.log(message);
		}
	};

	const acceptCall = () => {
		setIsRinging(false);
		setIsCallStarted(true);
		if ((user, loggedInUser)) {
			answerCall(offer, user, loggedInUser, peerConnection);
		} else {
			console.log(
				`ERROR!!!! user is ${user} loggedInUser is ${loggedInUser}`
			);
		}
	};

	const rejectCall = () => {
		console.log('rejected');
		setIsRinging(false);
		setIsVidoCall(false);
		setIsCallStarted(false);
	};

	const receiveAnswer = (message) => {
		console.log('call attended');
		peerConnection.setRemoteDescription(message.answer);
		console.log(peerConnection);
	};

	// for free export
	ringingTogler = startRinging;
	answerReceiver = receiveAnswer;

	return (
		<VideoCallContext.Provider
			value={{
				localMediaStream,
				setLocalMediaStream,
				remoteMediaStream,
				setRemoteMediaStream,
				selectedDevice,
				setSelectedDevice,
				peerConnection,
				startVideoCall,
				stopVideoCall,
				isRinging,
				startRinging,
				acceptCall,
				rejectCall,
			}}>
			{children}
			{user !== null && isVidoCall && (
				<VideoCaller user={user} loggedInUser={loggedInUser} />
			)}
			{user !== null && isRinging && <VideoCallRinger user={user} />}
			{isCallStarted && <VideoCallMain />}
		</VideoCallContext.Provider>
	);
};

export const useVideoCall = () => useContext(VideoCallContext);
export { ringingTogler as startRinging, answerReceiver as receiveAnswer };
