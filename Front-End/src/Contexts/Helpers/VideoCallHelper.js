import { socket } from '../WebsocketContext';

const getMediaStream = async (selectedDevice) => {
	const constraints = {
		audio: { echoCancellation: true },
		video: {
			deviceId: selectedDevice?.deviceId,
			video: true,
			audio: true,
		},
	};
	const openMediaDevices = async (constraints) => {
		return await navigator.mediaDevices.getUserMedia(constraints);
	};

	try {
		const stream = await openMediaDevices(constraints);
		return stream;
	} catch (error) {
		console.log(`Error accessing media devices. ${error}`);
	}
};

async function makeVideoCall(user, loggedInUser, peerConnection) {
	const offer = await peerConnection.createOffer();
	await peerConnection.setLocalDescription(offer);
	const signal = {
		type: 'video-call',
		from: loggedInUser.email,
		to: user.email,
		time: new Date().toLocaleString(),
		offer: offer,
		status: 'offer',
	};
	socket.forwardToWebSocket(signal);
	return peerConnection;
}

const answerCall = async (offer, user, loggedInUser, peerConnection) => {
	if (offer && user && loggedInUser) {
		peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
		const answer = await peerConnection.createAnswer();
		await peerConnection.setLocalDescription(answer);
		const answerMessage = {
			type: 'video-call',
			from: loggedInUser.email,
			to: user.email,
			time: new Date().toLocaleString(),
			answer: answer,
			status: 'answer',
		};
		socket.forwardToWebSocket(answerMessage);
	}
	return peerConnection;
};
export { makeVideoCall, getMediaStream, answerCall };
