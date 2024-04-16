import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import VideoCaller from './Helpers/videoCaller';
import {
	answerCall,
	getConnectedDevices,
	getMediaStream,
	iceCallback,
	makeVideoCall,
} from './Helpers/VideoCallHelper';
import { useAxios } from './AxiosContext';
import VideoCallRinger from './Helpers/VideoCallRinger';
import VideoCallMain from './Helpers/VideoCallMain';
// import { useWebSocket } from './WebsocketContext';

const VideoCallContext = createContext();
let ringingTogler = null;
let answerReceiver = null;
let iceReceiver = null;

const iceServers = [
	{ urls: 'stun:stun.l.google.com:19302' },
	{ urls: 'stun:stun1.l.google.com:19302' },
	// { urls: 'stun:stun2.l.google.com:19302' },
	// { urls: 'stun:stun3.l.google.com' },
	// { urls: 'stun:stun4.l.google.com' },
	// { urls: 'stun:stun.l.google.com:19302' },
];

const configuration = { iceServers };
let peerConnection = new RTCPeerConnection(configuration);

export const VideoCallProvider = ({ children }) => {
	const [isVidoCall, setIsVidoCall] = useState(false);
	const [isRinging, setIsRinging] = useState(false);
	const [isCallStarted, setIsCallStarted] = useState(false);
	const [localMediaStream, setLocalMediaStream] = useState(new MediaStream());
	const [remoteMediaStream, setRemoteMediaStream] = useState(
		new MediaStream()
	);
	const [selectedDevice, setSelectedDevice] = useState(null);
	const [user, setUser] = useState(null);

	const { loggedInUser } = useAuth();
	const axios = useAxios();

	// send iceCendidates to other user
	peerConnection.onicecandidate = (e) => {
		if (e.candidate) {
			iceCallback(user, loggedInUser, e.candidate);
		}
	};

	// receive icCandidate
	const iceRecieve = (message) => {
		// console.log(message);
		peerConnection.addIceCandidate(message.candidate);
	};

	peerConnection.onicecandidateerror = (e) => {
		console.log(e);
	};
	// if connection established.. ?
	peerConnection.onconnectionstatechange = (e) => {
		if (peerConnection.connectionState === 'connected') {
			console.log('peers connected');
		}
	};
	peerConnection.oniceconnectionstatechange = () => {
		if (peerConnection.iceConnectionState === 'failed') {
			console.log('peer connection failed, trying to restart Ice');
			peerConnection.restartIce();
		}
	};
	// Receive remote video
	peerConnection.ontrack = ({ track, streams }) => {
		// console.log(streams);
		// console.log(track);

		if (streams && streams.length > 0) {
			const remoteStream = new MediaStream();
			streams[0].getTracks().forEach((track) => {
				remoteStream.addTrack(track);
			});
			setRemoteMediaStream(remoteStream);
		}
	};

	// Runs when the video icon is pressed, sends offer,
	const startVideoCall = async (user) => {
		try {
			setUser(user);
			const stream = await getMediaStream();
			setLocalMediaStream(stream);
			stream
				.getTracks()
				.forEach((track) => peerConnection.addTrack(track, stream));
			const offer = await peerConnection.createOffer();
			await peerConnection.setLocalDescription(offer);
			makeVideoCall(user, loggedInUser, peerConnection.localDescription);
			setIsVidoCall(true);
		} catch (error) {
			console.error('Error starting video call:', error);
			// Add your error handling logic here
		}
	};

	// to close video calling window
	const stopVideoCall = () => {
		setIsVidoCall(false);
	};

	// incoming call, ringing side,  receives an 'offer' from caller, starts ringing
	const startRinging = async (message) => {
		if (message.from && message.offer) {
			// sets remote desc , the offer
			await peerConnection.setRemoteDescription(
				new RTCSessionDescription(message.offer)
			);
			axios.get(`user/${message.from}`).then((response) => {
				const user = response.data.user;
				setUser(user);
				setIsRinging(true);
			});
		} else {
			console.log('something went wrong in startRinging');
		}
	};

	// on ringing side, option one, sends answer to caller
	const acceptCall = async () => {
		if (user && loggedInUser) {
			const answer = await peerConnection.createAnswer();
			setIsRinging(false);
			setIsCallStarted(true);
			// get stream
			const stream = await getMediaStream();
			setLocalMediaStream(stream);
			// add stream to peerconnection
			stream
				.getTracks()
				.forEach((track) => peerConnection.addTrack(track, stream));
			await peerConnection.setLocalDescription(
				new RTCSessionDescription(answer)
			);
			answerCall(answer, user, loggedInUser);
		} else {
			console.log(
				`ERROR!!!! user is ${user} loggedInUser is ${loggedInUser}`
			);
		}
	};

	// on ringing side,  option two
	const rejectCall = () => {
		console.log('rejected');
		setIsRinging(false);
		setIsVidoCall(false);
		setIsCallStarted(false);
		setRemoteMediaStream(null);
		setLocalMediaStream(null);
	};

	// function that receives 'answer' message for the'offer' message that have send initially
	// at the sender side
	const receiveAnswer = async (message) => {
		const answer = message.answer;
		await peerConnection.setRemoteDescription(
			new RTCSessionDescription(answer)
		);
		setIsVidoCall(false);
		setIsCallStarted(true);
	};

	// for free export
	ringingTogler = startRinging;
	answerReceiver = receiveAnswer;
	iceReceiver = iceRecieve;

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
				iceRecieve,
			}}>
			{children}

			{/* for making a call , caller side */}
			{user !== null && isVidoCall && <VideoCaller user={user} />}

			{/* for ringer side, indiactor and controls */}
			{user !== null && isRinging && <VideoCallRinger user={user} />}

			{/* video call interface */}
			{isCallStarted && <VideoCallMain />}
		</VideoCallContext.Provider>
	);
};

export const useVideoCall = () => useContext(VideoCallContext);
export {
	ringingTogler as startRinging,
	answerReceiver as receiveAnswer,
	iceReceiver as iceRecieve,
};
