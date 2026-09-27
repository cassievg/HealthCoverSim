import React, { useState } from 'react';

import instance from '../libs/request';

import './quote-creation.css';
import '../index.css'

function QuoteCreation() {
	const [quoteDetails, setQuoteDetails] = useState({});

	const createQuote = async () => {
		await instance.post('/quotes/', 
			{
				
			}
		)
	}

	const updateDetails = (event) => {
        const {
            target
        } = event;

        setQuoteDetails((prev) => ({
            ...prev,
            [target.id]: target.value,
        }));
    }

	return (
		<div className='page-view'>
			<div className='form-container'>
				<div className='form-title'>Create Quote</div>

				<div className='form'>
					<div class='mb-3 customer-name'>
						<div className='label'>Customer Name:</div>
						<input class='form-control' type='text' placeholder='Name' aria-label='customer-name' id='customer-name' required onChange={updateDetails} />
					</div>

					<div className='label'>Cover Type:</div>
					<select class='form-select' aria-label='cover-type'>
						<option selected>Select</option>
						<option value='single'>Single</option>
						<option value='couple'>Couple</option>
						<option value='family'>Family</option>
					</select>

					<div class='mb-3 applicant1-age'>
						<div className='label'>Applicant 1 Age:</div>
						<input class='form-control' type='text' placeholder='18-100' aria-label='applicant1-age' id='applicant1-age' required onChange={updateDetails} />
					</div>

					<div className='label'>Applicant 1 Hospital Cover History:</div>
					<select class='form-select' aria-label='app1-history'>
						<option value=''>Select</option>
						<option value='yes'>Yes</option>
						<option value='no'>No</option>
						<option value='not-sure'>Not Sure</option>
					</select>

					<div class='mb-3 applicant2-age'>
						<div className='label'>Applicant 2 Age:</div>
						<input class='form-control' type='text' placeholder='18-100' aria-label='applicant2-age' id='applicant2-age' required onChange={updateDetails} />
					</div>

					<div className='label'>Applicant 2 Hospital Cover History:</div>
					<select class='form-select' aria-label='app2-history'>
						<option value=''>Select</option>
						<option value='yes'>Yes</option>
						<option value='no'>No</option>
						<option value='not-sure'>Not Sure</option>
					</select>

					<div className='label'>Hospital Cover Level:</div>
					<select class='form-select' aria-label='hospital-level'>
						<option value=''>Select</option>
						<option value='none'>None</option>
						<option value='basic'>Basic</option>
						<option value='bronze'>Bronze</option>
						<option value='silver'>Silver</option>
						<option value='gold'>Gold</option>
					</select>

					<div className='label'>Extras Cover Level:</div>
					<select class='form-select' aria-label='extras-level'>
						<option value=''>Select</option>
						<option value='none'>None</option>
						<option value='basic'>Basic</option>
						<option value='standard'>Standard</option>
						<option value='premium'>Premium</option>
					</select>

					<div className='label'>Payment Frequency:</div>
					<div class='form-check'>
						<input class='form-check-input' type='radio' name='radioDefault' id='pay-monthly' />
						<label class='form-check-label' for='pay-monthly'>
							Monthly
						</label>
					</div>
					<div class='form-check'>
						<input class='form-check-input' type='radio' name='radioDefault' id='pay-yearly' />
						<label class='form-check-label' for='pay-yearly'>
							Yearly
						</label>
					</div>
					
					<div class='mb-3 discount'>
						<div className='label'>Annual Payment Discount %:</div>
						<input class='form-control' type='text' placeholder='0-10%' aria-label='discount' id='discount' required onChange={updateDetails} />
					</div>

					<div class='mb-3 notes'>
						<div className='label'>Notes:</div>
						<input class='form-control' type='text' placeholder='Notes' aria-label='notes' id='notes' onChange={updateDetails} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default QuoteCreation;
