import React, { useState } from 'react';

import instance from '../libs/request';

import { validateQuote } from '../utils/validations';

import './quote-creation.css';
import '../index.css'

function QuoteCreation() {
	const [quoteDetails, setQuoteDetails] = useState({
		customer_name: '',
        cover_type: '',
        applicant1_age: '',
        applicant1_cover_history: '',
        applicant2_age: '',
        applicant2_cover_history: '',
        hospital_cover: '',
        extras_cover: '',
        payment_frequency: '',
        annual_discount: '',
        notes: ''
	});
	const [message, setMessage] = useState('');


	const updateDetails = (event) => {
        const {
            target
        } = event;

        setQuoteDetails((prev) => ({
            ...prev,
            [target.id]: target.value,
        }));
    }


	const createQuote = async (event) => {
		event.preventDefault();

		const quote = {
			...quoteDetails,
			customer_name: quoteDetails.customer_name.trim(),
			applicant1_age: Number(quoteDetails.applicant1_age),
			applicant2_age: quoteDetails.cover_type === 'single' ? null : Number(quoteDetails.applicant2_age),
			applicant2_cover_history: quoteDetails.cover_type === 'single' ? null : quoteDetails.applicant2_cover_history,
			annual_discount: quoteDetails.payment_frequency === 'monthly' ? 0 : Number(quoteDetails.annual_discount),
			notes: quoteDetails.notes.trim() || null
		}

		const error = validateQuote(quote);

		if (error) {
			setMessage(error);
			return;
		} else {
			setMessage('');
		}

		try {
			const res = await instance.post('/quotes/', quote);

			setMessage(`Quote created successfully! ID: ${res.data.id}`);
		} catch (e) {
			console.error('create quote failed', e);
			setMessage(e.response?.data?.error || 'Failed to create quote.');
		}
	}


	return (
		<div className='page-view'>
			<div className='page-title'>Create Quote</div>
			
			<div className='form-container'>
				<div className='form'>
					<div className='input-container'>
						<div className='label'>Customer Name:</div>
						<input
							className='form-control'
							type='text'
							placeholder='Name'
							aria-label='customer_name'
							id='customer_name'
							value={quoteDetails.customer_name}
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
							value={quoteDetails.cover_type}
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
							value={quoteDetails.applicant1_age}
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
							value={quoteDetails.applicant1_cover_history}
							required
							onChange={updateDetails}
						>
							<option value=''>Select</option>
							<option value='yes'>Yes</option>
							<option value='no'>No</option>
							<option value='not sure'>Not Sure</option>
						</select>
					</div>

					{quoteDetails.cover_type !== 'single' &&
					quoteDetails.cover_type !== '' &&
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
										value={quoteDetails.applicant2_age}
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
										value={quoteDetails.applicant2_cover_history}
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
							value={quoteDetails.hospital_cover}
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
							value={quoteDetails.extras_cover}
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
							value={quoteDetails.annual_discount}
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
							value={quoteDetails.notes}
							onChange={updateDetails}
						/>
					</div>

					{message &&
						<div className='error-message'>
							{message}
						</div>
					}

					<div className='submit-container'>
						<button className='submit-button' onClick={createQuote}>Create</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default QuoteCreation;
