import React, { useEffect, useRef, useState } from 'react';

function ImageEditor({
	base64Image,
	setBase64Image,
	setFinalImage,
	setCameraOn,
	user,
}) {
	const [image, setImage] = useState(null);
	const captionRef = useRef(null);
	const dataUriToBlob = (dataUri) => {
		const parts = dataUri.split(';base64,');
		const contentType = parts[0].split(':')[1];
		const byteString = atob(parts[1]);

		const arrayBuffer = new ArrayBuffer(byteString.length);
		const uint8Array = new Uint8Array(arrayBuffer);

		for (let i = 0; i < byteString.length; i++) {
			uint8Array[i] = byteString.charCodeAt(i);
		}

		return new Blob([arrayBuffer], { type: contentType });
	};

	const handleSaveImage = () => {
		const data = { image: image, caption: captionRef.current.value };
		setFinalImage(data);
		setCameraOn(false);
		setBase64Image(null);
	};

	useEffect(() => {
		if (base64Image) setImage(dataUriToBlob(base64Image));
	}, [base64Image]);
	return (
		<>
			{image ? (
				<div className=''>
					{/* close button on top */}
					<button
						className='absolute top-3 right-3'
						onClick={() => {
							setCameraOn(true);
							setBase64Image(null);
						}}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-6 h-6 text-white'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 18 18 6M6 6l12 12'
							/>
						</svg>
					</button>
					{/* current image */}
					<div className=' max-w-full object-contain'>
						<img
							src={URL.createObjectURL(image)}
							alt=''
							className='max-w-full object-contain'
						/>
					</div>

					<div className=' absolute bottom-4 px-2  min-w-full'>
						{/* caption */}
						<div className='flex justify-center'>
							<input
								type='text'
								name=''
								id=''
								className=' w-full my-2 rounded-full bg-themeBlueSecondary text-themeText1'
								placeholder='Add a caption'
								ref={captionRef}
							/>
						</div>
						<div className='flex justify-between items-center text-white'>
							<span className='rounded-full bg-themeBlue px-2'>
								{user.firstName}
							</span>

							{/* confirm button */}
							<button className=' bg-themeGreenButton1 rounded-full min-w-[3.3rem] aspect-square hover:bg-themeGreenButton2 active:bg-themeGreenButton3 flex justify-center items-center '>
								<svg
									onClick={handleSaveImage}
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
							</button>
						</div>
					</div>
				</div>
			) : (
				<div>Loading..</div>
			)}
		</>
	);
}

export default ImageEditor;
