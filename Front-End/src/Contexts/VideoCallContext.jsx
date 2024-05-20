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
import { socket } from './WebsocketContext';
// import { useWebSocket } from './WebsocketContext';

const VideoCallContext = createContext();
let ringingTogler = null;
let answerReceiver = null;
let iceReceiver = null;
let onCallReject = null;
let callStateSetter = null;

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
	const [callState, setCallState] = useState('');
	const [ringTimer, setRingTimer] = useState(0);
	const [isCallStarted, setIsCallStarted] = useState(false);
	const [localMediaStream, setLocalMediaStream] = useState(null);
	const [remoteMediaStream, setRemoteMediaStream] = useState(null);
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
		console.log('ice received and added');
		peerConnection.addIceCandidate(message.candidate);
	};

	peerConnection.onicecandidateerror = (e) => {
		console.log(e.errorText);
	};
	// if connection established.. ?
	peerConnection.onconnectionstatechange = (e) => {
		if (peerConnection.connectionState === 'connected') {
			console.log('peers connected');
		}
	};
	// on fail to ice congig
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

	// manages the call state, $calling , $ringing,
	const changeCallState = (stateString) => {
		setCallState(stateString);
	};

	const startTimer = (callback) => {
		return setTimeout(callback, 30000); // 30 seconds
	};

	const stopTimer = (timerId) => {
		clearTimeout(ringTimer);
	};

	// Runs when the video icon is pressed, sends offer, the caller side
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
			changeCallState('calling');
			const timerId = startTimer(() => {
				console.log('Timer finished');
				rejectCall();
			});
			setRingTimer(timerId);
		} catch (error) {
			console.error('Error starting video call:', error);
			// Add your error handling logic here
		}
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
		stopTimer();
	};

	// incoming call, ringing side,  receives an 'offer' from caller, starts ringing
	const startRinging = async (message) => {
		if (message.from && message.offer) {
			// sets remote desc , the offer
			await peerConnection.setRemoteDescription(
				new RTCSessionDescription(message.offer)
			);
			// get stream
			const stream = await getMediaStream();
			setLocalMediaStream(stream);

			// add stream to peerconnection
			stream
				.getTracks()
				.forEach((track) => peerConnection.addTrack(track, stream));

			axios.get(`user/${message.from}`).then((response) => {
				const user = response.data.user;
				setUser(user);
				setIsRinging(true);
				const timerId = startTimer(() => {
					console.log('Timer finished');
					rejectCall();
				});
				setRingTimer(timerId);
			});
		} else {
			console.log('something went wrong in startRinging');
		}
	};

	// on ringing side, option one, sends answer to caller
	const acceptCall = async () => {
		if (user && loggedInUser) {
			try {
				const answer = await peerConnection.createAnswer();
				answerCall(answer, user, loggedInUser);
				await peerConnection.setLocalDescription(
					new RTCSessionDescription(answer)
				);

				setIsRinging(false);
				setIsCallStarted(true);
				stopTimer();
			} catch (error) {
				console.log('Error accepting call:', error);
				// Add your error handling logic here
			}
		} else {
			console.log(
				`ERROR!!!! user is ${user} loggedInUser is ${loggedInUser}`
			);
		}
	};

	// for both sides, to end calls  option two
	const rejectCall = (e) => {
		console.log('rejected');
		endCall();
		if (e) {
			// call rejected side
			// can be used for loging info

			// inform the other side of rejection
			const rejection = {
				type: 'video-call',
				from: loggedInUser.email,
				to: user.email,
				time: new Date().toLocaleString(),
				status: 'end-call',
			};
			socket.forwardToWebSocket(rejection);
		} else {
			// the other side who got rejectd
		}
	};

	// call ending procedures
	const endCall = () => {
		setIsRinging(false);
		setIsVidoCall(false);
		setIsCallStarted(false);
		setRemoteMediaStream(null);
		setLocalMediaStream(null);
		changeCallState('');
		stopTimer();
		// Close all tracks
		peerConnection.getSenders().forEach((sender) => sender.track?.stop());
		// Close the connection
		peerConnection.close();
		// Reset peerConnection
		peerConnection = new RTCPeerConnection(configuration);
	};

	// for free export
	ringingTogler = startRinging;
	answerReceiver = receiveAnswer;
	iceReceiver = iceRecieve;
	onCallReject = rejectCall;
	callStateSetter = changeCallState;

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
				isRinging,
				startRinging,
				acceptCall,
				rejectCall,
				iceRecieve,
				setCallState,
			}}>
			{children}

			{/* for making a call , caller side */}
			{user !== null && isVidoCall && (
				<VideoCaller user={user} callState={callState} />
			)}

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
	onCallReject as rejectCall,
	callStateSetter as changeCallState,
};
