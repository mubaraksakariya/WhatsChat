import React, { useState } from 'react';

function Confirmation({ message, onConfirm, onReject, checkBoxList = [] }) {
	const [selectedCheckBoxIndexes, setSelectedCheckBoxIndexes] = useState([]);

	const handleCheckboxChange = (event, index) => {
		const { checked } = event.target;

		if (checked) {
			setSelectedCheckBoxIndexes([...selectedCheckBoxIndexes, index]);
		} else {
			setSelectedCheckBoxIndexes(
				selectedCheckBoxIndexes.filter((i) => i !== index)
			);
		}
	};

	return (
		<div className='absolute w-screen max-w-lg min-h-screen bg-themeBlueSecondary flex justify-center items-center bg-opacity-50'>
			<div className='bg-themeBlue rounded-[10px] p-5'>
				<div className='p-2 pb-5 text-themeText1'>{message}</div>
				{checkBoxList.length > 0 && (
					<div className='px-2 pb-6 flex flex-col items-center'>
						{checkBoxList.map((item, index) => (
							<div key={index} className='py-1'>
								<input
									type='checkbox'
									id={item}
									onChange={(e) =>
										handleCheckboxChange(e, index)
									}
								/>
								<label
									className='text-themeText1 ps-2'
									htmlFor={item}>
									{item}
								</label>
							</div>
						))}
					</div>
				)}
				<div className=' flex justify-center gap-2'>
					<button
						onClick={() => {
							onConfirm(selectedCheckBoxIndexes.sort());
						}}
						type='button'
						className='text-themeText1 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>
						Yes
					</button>
					<button
						onClick={() => onReject()}
						type='button'
						className='text-themeText1 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>
						No
					</button>
				</div>
			</div>
		</div>
	);
}

export default Confirmation;
