import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './ChatInput.css';
import FileInput from './FileInput';
import CameraInput from './CameraInput';
import ChatMessageSendButton from './ChatMessageSendButton';
import AudioInputButton from './AudioInputButton';

function ChatInput({ user }) {
	const [text, setText] = useState('');
	const [attachment, setAttachment] = useState([]);
	const [cameraImage, setCameraImage] = useState();
	const [audioBlob, setAudioBlob] = useState(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const parentDivRef = useRef(null);
	const emojibtnRef = useRef(null);
	const inputRef = useRef(null);

	useEffect(() => {
		// Add event listener when the component mounts
		document.addEventListener('mousedown', handleClickOutside);

		// Clean up the event listener when the component unmounts
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	useEffect(() => {
		if (audioBlob) {
			const audioUrl = URL.createObjectURL(audioBlob);
			const audio = new Audio(audioUrl);
			audio.play();
		}
	}, [audioBlob]);

	const sendCameraImage = (image) => {
		console.log(image);
		setCameraImage(image);
		console.log('image send');
	};

	const handleClickOutside = (event) => {
		if (
			parentDivRef.current &&
			!parentDivRef.current.contains(event.target) &&
			!emojibtnRef.current.contains(event.target)
		) {
			setShowEmojiPicker(false);
		}
	};
	const emojiPickerToggle = () => {
		setShowEmojiPicker(!showEmojiPicker);
	};
	const onEmojiClick = (item) => {
		const inputElement = inputRef.current;
		if (inputElement) {
			const { selectionStart, selectionEnd } = inputElement;
			const newText =
				text.slice(0, selectionStart) +
				item.emoji +
				text.slice(selectionEnd);
			setText(newText);

			// Move the cursor to the position after the inserted emoji
			const newCursorPosition = selectionStart + item.emoji.length;
			inputElement.setSelectionRange(
				newCursorPosition,
				newCursorPosition
			);
		}
	};
	const sendAudio = () => {
		console.log('record audio');
	};
	const sendMessage = () => {
		console.log('send the text and attachment message');
	};

	return (
		<div className='flex overflow-visible'>
			<div
				ref={parentDivRef}
				className={`absolute bottom-10 left-0 ${
					showEmojiPicker ? '' : 'hidden'
				}`}>
				<EmojiPicker
					theme='dark'
					onEmojiClick={onEmojiClick}
					className={`emoji-picker ${
						showEmojiPicker ? 'visible' : 'hidden'
					}`}
				/>
			</div>

			<div className='flex w-full items-center rounded-full bg-themeBlueSecondary'>
				{/* emoji picker button */}
				<svg
					onClick={emojiPickerToggle}
					ref={emojibtnRef}
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='currentColor'
					className='w-6 h-6 mt-2 ms-2 mb-2 cursor-pointer'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z'
					/>
				</svg>

				{/*Input box  */}
				<div className='flex-1'>
					<input
						placeholder='Message'
						onChange={(event) => {
							setText(event.target.value);
						}}
						type='text'
						className='w-full bg-transparent border-none focus:ring-transparent caret-themeGreen'
						name=''
						id=''
						value={text}
						ref={inputRef}
					/>
				</div>

				{/* Attachment icon and button, file input */}
				<div className='mx-2'>
					<FileInput setAttachment={setAttachment} />
				</div>

				{/* Camera Icon and button */}
				{text === '' && (
					<div className='mx-2 me-4'>
						<CameraInput
							user={user}
							sendCameraImage={sendCameraImage}
						/>
					</div>
				)}
			</div>

			{text === '' ? (
				<AudioInputButton
					file={setAudioBlob}
					key={'1'}
					icon={
						// mic Icon
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-6 h-6 scale-100 ease-linear duration-200 transition-all'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z'
							/>
						</svg>
					}
				/>
			) : (
				<ChatMessageSendButton
					onclick={sendMessage}
					key={'2'}
					icon={
						// send Icon
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-6 h-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
							/>
						</svg>
					}
				/>
			)}
		</div>
	);
}

export default ChatInput;
