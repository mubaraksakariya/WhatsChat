import React, { createContext, useContext, useRef, useState } from 'react';
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
import { addCallLog } from '../HelperApi/CallLogApi';
import { addMessage } from '../HelperApi/MessageApi';
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
	// const [callLog, setCallLog] = useState({});
	const callLogRef = useRef();
	const callWaitingTime = 5000;
	const { loggedInUser } = useAuth();
	const axios = useAxios();

	const setCallLog = async (log) => {
		callLogRef.current = log;
	};
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

	// timer for calling and ringing
	const startTimer = (callback) => {
		return setTimeout(callback, callWaitingTime); // 30 seconds
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

			// set call log
			const log = {
				from: loggedInUser,
				to: user,
				callingTime: new Date().toISOString(),
				type: 'outgoing',
				status: 'calling',
			};
			setCallLog(log);

			changeCallState('calling');

			const timerId = startTimer(() => {
				const log = {
					...callLogRef.current,
					status: 'unattended',
				};
				setCallLog(log);
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
		setCallLog({
			...callLogRef.current,
			status: 'answered',
			callStartingTime: new Date().toISOString(),
		});
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
				// set call log
				const log = {
					from: user,
					to: loggedInUser,
					startTime: new Date().toISOString(),
					type: 'incoming',
					status: 'ringing',
				};
				setCallLog(log);
				const timerId = startTimer(async () => {
					console.log('Timer finished');
					await setCallLog({
						...callLogRef.current,
						status: 'missed',
					});
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
				// set call log
				setCallLog({
					...callLogRef.current,
					status: 'accepted',
					callStartingTime: new Date().toISOString(),
				});
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
	const rejectCall = async (e) => {
		// call rejected by purely clicking the button
		if (e) {
			// inform the other side of rejection
			console.log('rejected');
			const rejection = {
				type: 'video-call',
				from: loggedInUser.email,
				to: user.email,
				time: new Date().toLocaleString(),
				status: 'end-call',
			};
			socket.forwardToWebSocket(rejection);
			// set the call log
			if (callLogRef.current.type === 'outgoing') {
				if (callLogRef.current.status === 'calling') {
					console.log('cut the call before attending');
					setCallLog({
						...callLogRef.current,
						explanation: 'cut the call before attending',
					});
				}
				if (callLogRef.current.status === 'answered') {
					console.log('cut the call after talking');
					setCallLog({
						...callLogRef.current,
						callEndingTime: new Date().toISOString(),
						explanation: 'cut the call after talking',
					});
				}
			}
			if (callLogRef.current.type === 'incoming') {
				if (callLogRef.current.status === 'ringing') {
					console.log('cut the call on ringing');
					setCallLog({
						...callLogRef.current,
						explanation: 'cut the call on ringing',
					});
				}
				if (callLogRef.current.status === 'accepted') {
					console.log('cut the call after receiving');
					setCallLog({
						...callLogRef.current,
						callEndingTime: new Date().toISOString(),
						explanation: 'cut the call after receiving',
					});
				}
			}
		} else {
			if (callLogRef.current.type === 'outgoing') {
				if (callLogRef.current.status === 'unattended') {
					console.log(
						`call ended before attending, after ${callWaitingTime} seconds`
					);
					setCallLog({
						...callLogRef.current,
						explanation: `call ended before attending, after ${callWaitingTime} seconds`,
					});
				}
				if (callLogRef.current.status === 'calling') {
					console.log(
						'the call cut from the other side without attending'
					);
					setCallLog({
						...callLogRef.current,
						explanation:
							'the call cut from the other side without attending',
					});
				}
				if (callLogRef.current.status === 'answered') {
					console.log(
						'the call ended from the other side after talking'
					);
					setCallLog({
						...callLogRef.current,
						callEndingTime: new Date().toISOString(),
						explanation:
							'the call ended from the other side after talking',
					});
				}
			}
			if (callLogRef.current.type === 'incoming') {
				if (callLogRef.current.status === 'missed') {
					console.log(`the call ended without answering`);
					setCallLog({
						...callLogRef.current,
						explanation: `the call ended without answering`,
					});
				} else if (callLogRef.current.status === 'ringing') {
					console.log(
						'the call ended from the other side before answering'
					);
					setCallLog({
						...callLogRef.current,
						explanation:
							'the call ended from the other side before answering',
					});
				} else {
					console.log(
						'the call ended from the other side after talking'
					);
					setCallLog({
						...callLogRef.current,
						callEndingTime: new Date().toISOString(),
						explanation:
							'the call ended from the other side after talking',
					});
				}
			}
		}
		addCallLog(callLogRef.current);
		console.log(callLogRef.current);

		// add the log to message list too
		const callLogMessage = {
			type: 'callLog',
			from: callLogRef.current.from.email,
			to: callLogRef.current.to.email,
			time: callLogRef.current.callingTime,
			log: callLogRef.current,
		};
		await addMessage(callLogMessage);
		callLogRef.current = {};
		endCall();
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
