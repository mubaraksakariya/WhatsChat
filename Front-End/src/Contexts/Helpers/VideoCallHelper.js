import { socket } from '../WebsocketContext';

const getMediaStream = async () => {
	const availableDevices = await getConnectedDevices('videoinput');
	const selectedDevice = availableDevices[0];
	const constraints = {
		audio: { echoCancellation: true },
		video: {
			deviceId: selectedDevice?.deviceId,
			video: true,
			audio: true,
		},
	};

	try {
		const stream = await navigator.mediaDevices.getUserMedia(constraints);
		return stream;
	} catch (error) {
		console.error(`Error accessing media devices: ${error}`);
		throw error; // Rethrow the error to handle it at a higher level
	}
};
// get all the media devices
// const getConnectedDevices = async (type) => {
// 	const devices = await navigator.mediaDevices.enumerateDevices();
// 	return devices.filter((device) => device.kind === type);
// };
const getConnectedDevices = async (type) => {
	const devices = await navigator.mediaDevices.enumerateDevices();
	const videoDevices = devices.filter((device) => device.kind === type);
	const availableDevices = [];

	for (const device of videoDevices) {
		let stream = null;
		const constraints = {
			audio: { echoCancellation: true },
			video: {
				deviceId: device?.deviceId,
				video: true,
				audio: true,
			},
		};
		try {
			stream = await navigator.mediaDevices.getUserMedia(constraints);
		} catch (error) {
			console.log(`${error}`);
			// Ignore errors and continue to the next device
		}

		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			if (device.kind === type) {
				availableDevices.push(device);
			}
		}
	}

	// console.log(availableDevices);
	return availableDevices;
};

async function makeVideoCall(user, loggedInUser, offer) {
	const signal = {
		type: 'video-call',
		from: loggedInUser.email,
		to: user.email,
		time: new Date().toLocaleString(),
		offer: offer,
		status: 'offer',
	};
	try {
		socket.forwardToWebSocket(signal);
	} catch (error) {
		console.error(`Error creating offer: ${error}`);
		throw error; // Rethrow the error to handle it at a higher level
	}
}

const answerCall = async (answer, user, loggedInUser) => {
	const answerMessage = {
		type: 'video-call',
		from: loggedInUser.email,
		to: user.email,
		time: new Date().toLocaleString(),
		answer: answer,
		status: 'answer',
	};
	try {
		socket.forwardToWebSocket(answerMessage);
	} catch (error) {
		console.error(`Error answering call: ${error}`);
		throw error; // Rethrow the error to handle it at a higher level
	}
};

// send iceCandidate to other user
const iceCallback = (user, loggedInUser, candidate) => {
	const iceCandi = {
		type: 'video-call',
		from: loggedInUser.email,
		to: user.email,
		time: new Date().toLocaleString(),
		candidate: candidate,
		status: 'icecandidate',
	};
	socket.forwardToWebSocket(iceCandi);
	// console.log('peer connection event, sending iceCandidate');
	// console.log(event);
};

export {
	makeVideoCall,
	getMediaStream,
	answerCall,
	iceCallback,
	getConnectedDevices,
};
