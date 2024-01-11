import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = ({ start, onStop }) => {
	const mediaRecorderRef = useRef(null);
	const chunksRef = useRef([]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			mediaRecorderRef.current = new MediaRecorder(stream);

			mediaRecorderRef.current.ondataavailable = (event) => {
				if (event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
			};

			mediaRecorderRef.current.onstop = () => {
				const audioBlob = new Blob(chunksRef.current, {
					type: 'audio/wav',
				});
				// const audioUrl = URL.createObjectURL(audioBlob);
				// Do something with the audio URL, e.g., save it or play it
				// const audio = new Audio(audioUrl);
				// audio.play();
				onStop(audioBlob);

				// Optionally, you can save the audio Blob as a file
				// const audioFile = new File([audioBlob], 'recorded_audio.wav', { type: 'audio/wav' });
				// console.log(audioFile);
				chunksRef.current = [];
			};

			mediaRecorderRef.current.start();
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	};

	const stopRecording = () => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state === 'recording'
		) {
			mediaRecorderRef.current.stop();

			// Access the stream from the media recorder
			const stream = mediaRecorderRef.current.stream;

			// Stop all tracks in the stream to close the microphone
			stream.getTracks().forEach((track) => track.stop());
		}
	};

	useEffect(() => {
		if (start) {
			startRecording();
		} else {
			stopRecording();
		}
	}, [start]);

	return <></>;
};

export default AudioRecorder;
