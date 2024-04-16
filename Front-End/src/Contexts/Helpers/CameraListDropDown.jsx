import React, { useEffect, useState } from 'react';
import { useVideoCall } from '../VideoCallContext';
import { getConnectedDevices } from './VideoCallHelper';

function CameraListDropDown() {
	const [isOpen, setIsOpen] = useState(false);
	const [allDevices, setAllDevices] = useState([]);
	const { setSelectedDevice, selectedDevice } = useVideoCall();

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleDeviceSelect = (device) => {
		setSelectedDevice(device);
		setIsOpen(false);
	};

	useEffect(() => {
		getConnectedDevices('videoinput').then((devices) => {
			// console.log(devices);
			setAllDevices(devices);
			setSelectedDevice(devices[0]);
		});
	}, []);

	return (
		<div className='relative'>
			<button
				id='dropdownTopButton'
				onClick={toggleDropdown}
				className='truncate me-3 mb-3 md:mb-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
				type='button'
				style={{ maxWidth: '8rem' }} // Adjust max width as needed
			>
				{selectedDevice ? selectedDevice.label : 'please wait'}
				<svg
					className={`w-2.5 h-2.5 ms-3 transform ${
						isOpen ? 'rotate-180' : ''
					}`}
					aria-hidden='true'
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 10 6'>
					<path
						stroke='currentColor'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M9 5 5 1 1 5'
					/>
				</svg>
			</button>

			{isOpen && (
				<div
					id='dropdownTop'
					className='z-10 absolute bottom-full bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700'
					style={{ top: 'auto', bottom: 'calc(100% + 5px)' }}>
					<ul
						className='py-2 text-sm text-gray-700 dark:text-gray-200'
						aria-labelledby='dropdownTopButton'>
						{allDevices.map((device, index) => (
							<li key={index}>
								<button
									onClick={() => handleDeviceSelect(device)}
									className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
									{device.label}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default CameraListDropDown;
