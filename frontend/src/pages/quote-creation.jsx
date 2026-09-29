import React, { useState } from 'react';

import instance from '../libs/request';

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

	const validateQuote = (quote) => {
		if (!quote) {
			return 'Quote body is missing.';
		}


		const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

		if (
			typeof quote.customer_name !== 'string' ||
			quote.customer_name.trim() === ''
		) {
			return 'Customer name is required.';
		}

		if (!nameRegex.test(quote.customer_name.trim())) {
			return 'Customer name contains invalid characters.';
		}


		const validCoverTypes = ['single', 'couple', 'family'];

		if (!validCoverTypes.includes(quote.cover_type)) {
			return 'Cover type is invalid.';
		}


		const age1 = Number(quote.applicant1_age);

		if (
			quote.applicant1_age === '' ||
			!Number.isInteger(age1) ||
			age1 < 18 ||
			age1 > 100
		) {
			return 'Age 1 must be a number between 18-100.';
		}


		const validCoverHistory = ['yes', 'no', 'not sure'];

		if (!validCoverHistory.includes(quote.applicant1_cover_history)) {
			return 'Cover history 1 is invalid.';
		}


		if (quote.cover_type === 'single') {
			if (
				quote.applicant2_age !== '' &&
				quote.applicant2_age !== null
			) {
				return 'Applicant 2 details must be empty for single cover.'
			}

			if (
				quote.applicant2_cover_history !== '' &&
				quote.applicant2_cover_history !== null
			) {
				return 'Applicant 2 details must be empty for single cover.'
			}
		}
		
		if (quote.cover_type !== 'single') {
			const age2 = Number(quote.applicant2_age);

			if (
				quote.applicant2_age === '' ||
				!Number.isInteger(age2) ||
				age2 < 18 ||
				age2 > 100
			) {
				return 'Age 2 must be a number between 18-100.';
			}

			if (!validCoverHistory.includes(quote.applicant2_cover_history)) {
				return 'Cover history 2 is invalid.';
			}
		}


		const validHospitalCover = ['none', 'basic', 'bronze', 'silver', 'gold'];

		if (!validHospitalCover.includes(quote.hospital_cover)) {
			return 'Hospital cover level is invalid.';
		}


		const validExtrasCover = ['none', 'basic', 'standard', 'premium'];

		if (!validExtrasCover.includes(quote.extras_cover)) {
			return 'Extras cover level is invalid.';
		}


		const validPayment = ['monthly', 'yearly'];

		if (!validPayment.includes(quote.payment_frequency)) {
			return 'Payment frequency is invalid.';
		}

		if (quote.payment_frequency === 'yearly') {
			const discount = Number(quote.annual_discount);

			if (
				quote.annual_discount === '' ||
				!Number.isInteger(discount) ||
				discount < 0 ||
				discount > 10
			) {
				return 'Annual discount must be a number between 0-10.';
			}
		}

		if (
			quote.payment_frequency === 'monthly' &&
			quote.annual_discount !== '' &&
			Number(quote.annual_discount) !== 0
		) {
			return 'Annual discount must be 0 for monthly payment.';
		}


		if (
			quote.notes !== '' &&
			quote.notes !== null &&
			typeof quote.notes !== 'string'
		) {
			return 'Notes must be a string.';
		}


		return null;
	};


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
								required
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
								required
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
							required
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
