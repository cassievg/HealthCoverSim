import React, { useState, useEffect } from 'react';

import instance from '../libs/request';

import './quote-detail.css';
import '../index.css'
import { calculateLHC, calculateHosPrem, calculateExtPrem, calculateMonthPrem, calculateYearDisc, hosCovConverter, extCovConverter } from '../utils/calculations';

function QuoteDetail() {
	const [quotes, setQuotes] = useState([]);
	const [selectedQuote, setSelectedQuote] = useState(null);

	const openModal = (quote) => {
		setSelectedQuote(quote);
	};

	const closeModal = () => {
		setSelectedQuote(null);
	};

	const familyBool = (selectedQuote) => {
		return selectedQuote.cover_type === 'family';
	};

	const monthlyPremium = (selectedQuote) => {
		return calculateMonthPrem(totalHosPrem(selectedQuote), totalExtPrem(selectedQuote), familyBool(selectedQuote));
	};

	const yearlyPremium = (amt) => {
		return amt * 12;
	};

	const yearlyWithDiscount = (amt, dsc) => {
		return calculateYearDisc(amt, dsc);
	};

	const lhcAmt = (hospital_cover, lhc) => {
		return hosCovConverter[hospital_cover] * (lhc/100);
	};

	const appLhcPct = (selectedQuote, appNum) => {
		if (appNum === 1) {
			return calculateLHC(selectedQuote.applicant1_cover_history, selectedQuote.applicant1_age, selectedQuote.hospital_cover);
		} else {
			return calculateLHC(selectedQuote.applicant2_cover_history, selectedQuote.applicant2_age, selectedQuote.hospital_cover);
		}
	};

	const totalHosPrem = (selectedQuote) => {
		if (selectedQuote.applicant2_age) {
			return (calculateHosPrem(selectedQuote.hospital_cover, calculateLHC(selectedQuote.applicant2_cover_history, selectedQuote.applicant2_age, selectedQuote.hospital_cover)) +
					calculateHosPrem(selectedQuote.hospital_cover, calculateLHC(selectedQuote.applicant1_cover_history, selectedQuote.applicant1_age, selectedQuote.hospital_cover)));
		} else {
			return calculateHosPrem(selectedQuote.hospital_cover, calculateLHC(selectedQuote.applicant1_cover_history, selectedQuote.applicant1_age, selectedQuote.hospital_cover));
		}
	};

	const totalExtPrem = (selectedQuote) => {
		if (selectedQuote.applicant2_age) {
			return (calculateExtPrem(selectedQuote.extras_cover, 2));
		} else {
			return (calculateExtPrem(selectedQuote.extras_cover, 1));
		}
	};

	const roundUp = (amt) => {
		return Math.ceil((amt - Number.EPSILON)*100)/100;
	};

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
			<div className='page-title'>Quotes Details</div>

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
									<td className='view-container'>
										<button className='view-button' onClick={() => {openModal(quote)}}>
											View
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
							<div className='data-container'>
								<div className='data-label'>Customer Name:</div>
								<div className='data'>{selectedQuote.customer_name}</div>
							</div>

							<div className='data-container'>
								<div className='data-label'>Customer Notes:</div>
								<div className='data'>{selectedQuote.notes ? selectedQuote.notes : '-'}</div>
							</div>

							<div className='data-container'>
								<div className='data-label'>Cover Type:</div>
								<div className='data'>{selectedQuote.cover_type}</div>
							</div>

							<div className='data-container'>
								<div className='data-label'>Hospital Cover:</div>
								<div className='data'>{selectedQuote.hospital_cover}</div>
								<div className='data'>${hosCovConverter[selectedQuote.hospital_cover]} / adult / month</div>
							</div>

							<div className='data-container'>
								<div className='data-label'>Extras Cover:</div>
								<div className='data'>{selectedQuote.extras_cover}</div>
								<div className='data'>${extCovConverter[selectedQuote.extras_cover]} / adult / month</div>
							</div>

							<div className='data-container'>
								<div className='data-label'>Applicant 1:</div>
								<div className='data'>
									Age: {selectedQuote.applicant1_age} 
									{(
										selectedQuote.applicant1_cover_history === 'no' &&
										selectedQuote.applicant1_age > 30 &&
										selectedQuote.hospital_cover !== 'none'
									) &&
										<div className='explanation-text'>
											{'('}Age {'>'} 30 → Receive {(selectedQuote.applicant1_age-30)*2}% LHC Rate{')'}
										</div>
									}
								</div>
								<div className='data'>Cover History: {selectedQuote.applicant1_cover_history}</div>
								<div className='line'>-------------------------------------------------------</div>
								<div className='calc-result'>LHC Loading %: {appLhcPct(selectedQuote, 1)}%</div>
								<div className='calc-result'>LHC Loading Amt: ${lhcAmt(selectedQuote.hospital_cover, appLhcPct(selectedQuote, 1))}</div>
								<div className='calc-result'>Applicant 1 Hospital Premium: ${calculateHosPrem(selectedQuote.hospital_cover, appLhcPct(selectedQuote, 1))}</div>
								{selectedQuote.applicant1_cover_history === 'not sure' && 
									<div className='warning-text'>
										Applicant 1: Cover history unknown. LHC loading was not applied. This quote may be inaccurate.
									</div>
								}
							</div>

							{selectedQuote.applicant2_age &&
								<div className='data-container'>
									<div className='data-label'>Applicant 2:</div>
									<div className='data'>
										Age: {selectedQuote.applicant2_age} 
										{(
											selectedQuote.applicant2_cover_history === 'no' &&
											selectedQuote.applicant2_age > 30 &&
											selectedQuote.hospital_cover !== 'none'
										) &&
											<div className='explanation-text'>
												{'('}Age {'>'} 30 → Receive {(selectedQuote.applicant2_age-30)*2}% LHC Rate{')'}
											</div>
										}
									</div>
									<div className='data'>Cover History: {selectedQuote.applicant2_cover_history}</div>
									<div className='line'>-------------------------------------------------------</div>
								<div className='calc-result'>LHC Loading %: {appLhcPct(selectedQuote, 2)}%</div>
								<div className='calc-result'>LHC Loading Amt: {lhcAmt(selectedQuote.hospital_cover, appLhcPct(selectedQuote, 2))}</div>
								<div className='calc-result'>Applicant 2 Hospital Premium: ${calculateHosPrem(selectedQuote.hospital_cover, appLhcPct(selectedQuote, 2))}</div>
									{selectedQuote.applicant2_cover_history === 'not sure' && 
										<div className='warning-text'>
											Applicant 2: Cover history unknown. LHC loading was not applied. This quote may be inaccurate.
										</div>
									}
								</div>
							}

							<div className='data-container'>
								<div className='data-label'>Hospital Total:</div>
								<div className='data'>
									{selectedQuote.applicant2_age ? 
										`$${calculateHosPrem(selectedQuote.hospital_cover, calculateLHC(selectedQuote.applicant2_cover_history, selectedQuote.applicant2_age, selectedQuote.hospital_cover))} + ${calculateHosPrem(selectedQuote.hospital_cover, calculateLHC(selectedQuote.applicant1_cover_history, selectedQuote.applicant1_age, selectedQuote.hospital_cover))}`
										:
										`$${calculateHosPrem(selectedQuote.hospital_cover, calculateLHC(selectedQuote.applicant1_cover_history, selectedQuote.applicant1_age, selectedQuote.hospital_cover))}`
									}
									
								</div>
								<div className='line'>-------------------------------------------------------</div>
								<div className='calc-result'>
									Total: ${totalHosPrem(selectedQuote)}
								</div>
							</div>

							<div className='data-container'>
								<div className='data-label'>Extras Total:</div>
								<div className='data'>
									${extCovConverter[selectedQuote.extras_cover]} × {selectedQuote.applicant2_age ? '2 adults' : '1 adult'}
								</div>
								<div className='line'>-------------------------------------------------------</div>
								<div className='calc-result'>
									Total: ${totalExtPrem(selectedQuote)}
								</div>
							</div>

							{selectedQuote.cover_type === 'family' &&
								<div className='data-container'>
									<div className='data-label'>Family Upgrade Fee:</div>
									<div className='data'>$30</div>
								</div>
							}

							<div className='data-container'>
								<div className='data-label'>Payment Frequency:</div>
								{selectedQuote.payment_frequency === 'monthly' ?
									<>
										<div className='data'>Monthly</div>
										<div className='data'>No Annual Discount</div>
									</>
								:
									<>
										<div className='data'>Yearly</div>
										<div className='data'>{selectedQuote.annual_discount}% Annual Discount</div>
									</>
								}
							</div>

							<div className='data-container'>
								<div className='data-label'>Monthly Premium:</div>
								<div className='data'>${totalHosPrem(selectedQuote)} + ${totalExtPrem(selectedQuote)}</div>
								<div className='line'>-------------------------------------------------------</div>
								<div className='calc-result'>${monthlyPremium(selectedQuote)}</div>
							</div>

							<div className='data-container'>
								<div className='data-label'>Raw Yearly Premium:</div>
								<div className='data'>${monthlyPremium(selectedQuote)} × 12</div>
								<div className='line'>-------------------------------------------------------</div>
								<div className='calc-result'>${yearlyPremium(monthlyPremium(selectedQuote))}</div>
							</div>

							<div className='data-container'>
								<div className='data-label'>Discounted Yearly Premium:</div>
								<div className='data'>${yearlyPremium(monthlyPremium(selectedQuote))} - {'('}{yearlyPremium(monthlyPremium(selectedQuote))} × {selectedQuote.annual_discount}%{')'}</div>
								<div className='line'>-------------------------------------------------------</div>
								<div className='calc-result'>${roundUp(yearlyWithDiscount(yearlyPremium(monthlyPremium(selectedQuote)), selectedQuote.annual_discount))}</div>
							</div>

							<div className='notes-container'>
								<div className='data-label'>Calculation Notes:</div>
								<div className='data'>
									<ul className="list-group">
										<li className="list-group-item">LHC loading only applies to hospital cover. It does not apply to the extras cover.</li>
										<li className="list-group-item">$30/month family upgrade fee is automatic for family cover types.</li>
										<li className="list-group-item">All prices are calculated per adult per month.</li>
										<li className="list-group-item">Monthly plans always receive 0% annual discount.</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			}
		</div>
	)
}

export default QuoteDetail;
