import React, { useState, useEffect } from 'react';

import instance from '../libs/request';

import './quote-list.css';
import '../index.css'

function QuoteList() {
	const [quotes, setQuotes] = useState([]);

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
			<div className='page-title'>Quotes List</div>

			<div className='table-container'>
				<table className='table table-striped table-hover'>
					<thead>
						<tr>
							<th scope='col'>ID</th>
							<th scope='col'>Customer Name</th>
							<th scope='col'>Hospital Cover</th>
							<th scope='col'>Extras Cover</th>
							<th scope='col'>Payment Frequency</th>
							<th scope='col'>Annual Discount</th>
							<th scope='col'>Created At</th>
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
										{quote.hospital_cover}
									</td>
									<td>
										{quote.extras_cover}
									</td>
									<td>
										{quote.payment_frequency}
									</td>
									<td>
										{quote.annual_discount}
									</td>
									<td>
										{quote.created_at}
									</td>
								</tr>
							))
						}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default QuoteList;
