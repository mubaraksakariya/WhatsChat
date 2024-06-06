import { socket } from '../WebsocketContext';

const getMediaStream = async (callType) => {
	console.log(callType);
	const availableDevices = await getConnectedDevices('videoinput');
	try {
		const selectedDevice = availableDevices[0];
		let constraints;

		if (callType === 'audio-call') {
			constraints = {
				audio: { echoCancellation: true },
				video: false,
			};
		} else if (callType === 'video-call') {
			constraints = {
				audio: { echoCancellation: true },
				video: {
					deviceId: selectedDevice?.deviceId,
				},
			};
		} else {
			throw new Error('Invalid call type. Must be "audio" or "video".');
		}
		const stream = await navigator.mediaDevices.getUserMedia(constraints);
		return stream;
	} catch (error) {
		console.log(`Error accessing media devices: ${error}`);
		// throw error; // Rethrow the error to handle it at a higher level
	}
};

const getConnectedDevices = async (type) => {
	if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
		console.error(
			'navigator.mediaDevices.enumerateDevices is not supported in this browser.'
		);
		return [];
	}

	try {
		const devices = await navigator.mediaDevices.enumerateDevices();
		const filteredDevices = devices.filter(
			(device) => device.kind === type
		);
		const availableDevices = [];

		for (const device of filteredDevices) {
			let stream = null;
			const constraints = {
				video:
					type === 'videoinput'
						? { deviceId: device.deviceId }
						: false,
				audio:
					type === 'audioinput'
						? { deviceId: device.deviceId }
						: false,
			};

			try {
				stream = await navigator.mediaDevices.getUserMedia(constraints);
				if (stream) {
					stream.getTracks().forEach((track) => track.stop());
					availableDevices.push(device);
				}
			} catch (error) {
				console.log(
					`Error accessing device ${device.label}: ${error.message}`
				);
				// Ignore errors and continue to the next device
			}
		}

		return availableDevices;
	} catch (error) {
		console.error(`Error enumerating devices: ${error.message}`);
		return [];
	}
};

async function makeVideoCall(user, loggedInUser, offer, callType) {
	const signal = {
		type: callType,
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
