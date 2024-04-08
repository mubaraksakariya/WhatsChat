import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import VideoCaller from './Helpers/videoCaller';
import { answerCall } from './Helpers/VideoCallHelper';
import { useAxios } from './AxiosContext';
import VideoCallRinger from './Helpers/VideoCallRinger';
import VideoCallMain from './Helpers/VideoCallMain';
import { useWebSocket } from './WebsocketContext';

const VideoCallContext = createContext();
let ringingTogler = null;
let answerReceiver = null;

const iceServers = [
	{ urls: 'stun:stun.l.google.com:19302' },
	{ urls: 'stun:stun1.l.google.com:19302' },
	{ urls: 'stun:stun2.l.google.com:19302' },
	{ urls: 'stun:stun3.l.google.com:19302' },
	{ urls: 'stun:stun4.l.google.com:19302' },
];

const configuration = { iceServers };
let peerConnection = new RTCPeerConnection(configuration);

export const VideoCallProvider = ({ children }) => {
	const socket = useWebSocket();

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

	peerConnection.onicecandidate = (event) => {
		if (event.candidate) {
			const iceCandi = {
				type: 'video-call',
				from: loggedInUser.email,
				to: user.email,
				time: new Date().toLocaleString(),
				candidate: event.candidate,
				status: 'icecandidate',
			};
			socket.forwardToWebSocket(iceCandi);
		}
		console.log('peer connection event');
		console.log(event);
	};

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
			console.log('something went wrong in startRinging');
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

	// function that receives 'answer' message for the'offer' message that have send initially
	const receiveAnswer = (message) => {
		peerConnection.setRemoteDescription(message.answer);
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
