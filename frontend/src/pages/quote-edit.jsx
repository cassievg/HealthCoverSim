import React, { useState, useEffect } from 'react';

import instance from '../libs/request';

import { validateQuote } from '../utils/validations';

import './quote-edit.css';
import '../index.css'

function QuoteEdit() {
	const [quotes, setQuotes] = useState([]);
	const [selectedQuote, setSelectedQuote] = useState(null);
	const [editedQuote, setEditedQuote] = useState(null);
	const [message, setMessage] = useState('');
	const [deleteQuote, setDeleteQuote] = useState(null);
	const [deleteSuccess, setDeleteSuccess] = useState(false);

	const openModal = (quote) => {
		setSelectedQuote(quote);
		setEditedQuote(quote);
	};

	const closeModal = () => {
		setSelectedQuote(null);
	};

	const deleteConfirmation = (quote) => {
		setDeleteQuote(quote);
	};

	const cancelDelete = () => {
		setDeleteQuote(null);
	};

	const deleteReq = async (quote) => {
		try {
			await instance.delete(`/quotes/${quote.id}`);

			setQuotes((prevQuotes) => 
				prevQuotes.filter((item) => item.id !== quote.id)
			);

			setDeleteQuote(null);
			setDeleteSuccess(true);
			setMessage('');
		}  catch (e) {
			console.error('delete quote fail', e);
			setMessage(e.response?.data?.error || 'Failed to delete quote.');
		}
	};

	const editQuote = async () => {
		const quote = {
			...editedQuote,
			customer_name: editedQuote.customer_name.trim(),
			applicant1_age: Number(editedQuote.applicant1_age),
			applicant2_age: editedQuote.cover_type === 'single' ? null : Number(editedQuote.applicant2_age),
			applicant2_cover_history: editedQuote.cover_type === 'single' ? null : editedQuote.applicant2_cover_history,
			annual_discount: editedQuote.payment_frequency === 'monthly' ? 0 : Number(editedQuote.annual_discount),
			notes: (editedQuote.notes ?? '').trim() || null
		}

		const error = validateQuote(quote);

		if (error) {
			setMessage(error);
			return;
		} else {
			setMessage('');
		}

		try {
			const res = await instance.put(`/quotes/${quote.id}`, quote);

			setQuotes((prevQuotes) => 
				prevQuotes.map((item) => 
					item.id === quote.id ? { ...item, ...quote } : item	
				)
			);

			setMessage(`Quote updated successfully! ID: ${res.data.id}`);
		} catch (e) {
			console.error('update quote failed', e);
			setMessage(e.response?.data?.error || 'Failed to update quote.');
		}
	}

	const updateDetails = (event) => {
        const {
            target
        } = event;

        setEditedQuote((prev) => ({
            ...prev,
            [target.id]: target.value,
        }));
    }

	useEffect(() => {
		const initQuotes = async () => {
			const quotes = await instance.get('/quotes/');
			const quotesData = [...quotes.data];
			const mappedQuotes = quotesData.map((item) => {
				return {
					id: item.id,
					customer_name: item.customer_name,
					cover_type: item.cover_type,
					applicant1_age: item.applicant1_age,
					applicant1_cover_history: item.applicant1_cover_history,
					applicant2_age: item.applicant2_age,
					applicant2_cover_history: item.applicant2_cover_history,
					hospital_cover: item.hospital_cover,
					extras_cover: item.extras_cover,
					payment_frequency: item.payment_frequency,
					annual_discount: item.annual_discount,
					notes: item.notes,
					created_at: item.created_at
				}
			});

			setQuotes(mappedQuotes);
		}

		initQuotes();
	}, []);

	return (
		<div className='page-view'>
			<div className='page-title'>Quotes Edits</div>

			<div className='table-container'>
				<table className='table'>
					<thead>
						<tr>
							<th scope='col'>ID</th>
							<th scope='col'>Customer Name</th>
							<th scope='col'>Created At</th>
							<th scope='col'></th>
						</tr>
					</thead>
					<tbody>
						{
							quotes.map((quote) => (
								<tr key={quote.id}>
									<th scope='row'>
										{quote.id}
									</th>
									<td>
										{quote.customer_name}
									</td>
									<td>
										{new Date(quote.created_at).toLocaleString()}
									</td>
									<td className='edit-container'>
										<button className='edit-button' onClick={() => {openModal(quote)}}>
											Edit
										</button>
										<button className='edit-button' onClick={() => {deleteConfirmation(quote)}}>
											Delete
										</button>
									</td>
								</tr>
							))
						}
					</tbody>
				</table>
			</div>

			{selectedQuote &&
				<div className='modal-overlay'>
					<div className='modal-container'>
						<div className='modal-header'>
							<div className='modal-header-text'>Quote #{selectedQuote.id}</div>
							<div className='close-container'>
								<button type='button' className='close-button' onClick={closeModal}>X</button>
							</div>
						</div>
						<div className='modal-content'>
							<div className='edit-form-container'>
								<div className='edit-form'>
									<div className='input-container'>
										<div className='label'>Customer Name:</div>
										<input
											className='form-control'
											type='text'
											placeholder='Name'
											aria-label='customer_name'
											id='customer_name'
											value={editedQuote.customer_name}
											required
											onChange={updateDetails}
										/>
									</div>

									<div className='input-container'>
										<div className='label'>Cover Type:</div>
										<select
											className='form-select'
											aria-label='cover_type'
											id='cover_type'
											value={editedQuote.cover_type}
											required
											onChange={updateDetails}
										>
											<option value=''>Select</option>
											<option value='single'>Single</option>
											<option value='couple'>Couple</option>
											<option value='family'>Family</option>
										</select>
									</div>

									<div className='input-container'>
										<div className='label'>Applicant 1 Age:</div>
										<input
											className='form-control'
											type='text'
											placeholder='18-100'
											aria-label='applicant1_age'
											id='applicant1_age'
											value={editedQuote.applicant1_age}
											required
											onChange={updateDetails}
										/>
									</div>

									<div className='input-container'>
										<div className='label'>Applicant 1 Hospital Cover History:</div>
										<select 
											className='form-select'
											aria-label='applicant1_cover_history'
											id='applicant1_cover_history'
											value={editedQuote.applicant1_cover_history}
											required
											onChange={updateDetails}
										>
											<option value=''>Select</option>
											<option value='yes'>Yes</option>
											<option value='no'>No</option>
											<option value='not sure'>Not Sure</option>
										</select>
									</div>

									{editedQuote.cover_type !== 'single' &&
									editedQuote.cover_type !== '' &&
										(
											<>
												<div className='input-container'>
													<div className='label'>Applicant 2 Age:</div>
													<input
														className='form-control'
														type='text'
														placeholder='18-100'
														aria-label='applicant2_age'
														id='applicant2_age'
														value={editedQuote.applicant2_age}
														required
														onChange={updateDetails}
													/>
												</div>

												<div className='input-container'>
													<div className='label'>Applicant 2 Hospital Cover History:</div>
													<select 
														className='form-select'
														aria-label='applicant2_cover_history'
														id='applicant2_cover_history'
														value={editedQuote.applicant2_cover_history}
														required
														onChange={updateDetails}
													>
														<option value=''>Select</option>
														<option value='yes'>Yes</option>
														<option value='no'>No</option>
														<option value='not sure'>Not Sure</option>
													</select>
												</div>
											</>
										)
									}

									<div className='input-container'>
										<div className='label'>Hospital Cover Level:</div>
										<select 
											className='form-select'
											aria-label='hospital_cover'
											id='hospital_cover'
											value={editedQuote.hospital_cover}
											required
											onChange={updateDetails}
										>
											<option value=''>Select</option>
											<option value='none'>None</option>
											<option value='basic'>Basic</option>
											<option value='bronze'>Bronze</option>
											<option value='silver'>Silver</option>
											<option value='gold'>Gold</option>
										</select>
									</div>

									<div className='input-container'>
										<div className='label'>Extras Cover Level:</div>
										<select 
											className='form-select'
											aria-label='extras_cover'
											id='extras_cover'
											value={editedQuote.extras_cover}
											required
											onChange={updateDetails}
										>
											<option value=''>Select</option>
											<option value='none'>None</option>
											<option value='basic'>Basic</option>
											<option value='standard'>Standard</option>
											<option value='premium'>Premium</option>
										</select>
									</div>

									<div className='input-container'>
										<div className='label'>Payment Frequency:</div>
										<div className='form-check'>
											<input
												className='form-check-input'
												type='radio'
												name='payment_frequency'
												id='payment_frequency'
												value='monthly'
												onChange={updateDetails}
												checked={editedQuote.payment_frequency === 'monthly'}
											/>
											<label className='form-check-label' htmlFor='payment_frequency'>
												Monthly
											</label>
										</div>
										<div className='form-check'>
											<input
												className='form-check-input'
												type='radio'
												name='payment_frequency'
												id='payment_frequency'
												value='yearly'
												onChange={updateDetails}
												checked={editedQuote.payment_frequency === 'yearly'}
											/>
											<label className='form-check-label' htmlFor='payment_frequency'>
												Yearly
											</label>
										</div>
									</div>
									
									<div className='input-container'>
										<div className='label'>Annual Payment Discount %:</div>
										<input
											className='form-control'
											type='text'
											placeholder='0-10 (%)'
											aria-label='annual_discount'
											id='annual_discount'
											value={editedQuote.annual_discount}
											required
											onChange={updateDetails}
										/>
									</div>

									<div className='input-container'>
										<div className='label'>Notes:</div>
										<input
											className='form-control'
											type='text'
											placeholder='Notes'
											aria-label='notes'
											id='notes'
											value={editedQuote.notes}
											onChange={updateDetails}
										/>
									</div>

									{message &&
										<div className='error-message'>
											{message}
										</div>
									}

									<div className='submit-container'>
										<button className='submit-button' onClick={editQuote}>Save</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			}

			{deleteQuote &&
				<div className='modal-overlay'>
					<div className='modal-container'>
						<div className='modal-header'>
							<div className='modal-header-text'>Delete Confirmation - Quote #{deleteQuote.id}</div>
							<div className='close-container'>
								<button type='button' className='close-button' onClick={cancelDelete}>X</button>
							</div>
						</div>
						<div className='modal-content'>
							<div className='delete-message'>
								Are you sure you want to delete this quote?
							</div>
						</div>

						{message &&
							<div className='error-message'>
								{message}
							</div>
						}

						<div className='delete-buttons'>
							<button className='view-button' onClick={cancelDelete}>
								Cancel
							</button>
							<button className='view-button' onClick={() => {deleteReq(deleteQuote)}}>
								Delete
							</button>
						</div>
					</div>
				</div>
			}

			{deleteSuccess &&
				<div className='modal-overlay'>
					<div className='modal-container'>
						<div className='modal-header'>
							<div className='modal-header-text'>Deletion Success</div>
							<div className='close-container'>
								<button type='button' className='close-button' onClick={() => {setDeleteSuccess(false); setMessage('')}}>X</button>
							</div>
						</div>
						<div className='modal-content'>
							<div className='delete-message'>
								Quote has been successfully deleted.
							</div>
						</div>
					</div>
				</div>
			}
		</div>
	)
}

export default QuoteEdit;
