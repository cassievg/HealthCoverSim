import React, { useState } from 'react';

import instance from '../libs/request';

import './quote-creation.css';
import '../index.css'

function QuoteCreation() {
	const [newQuote, setNewQuote] = useState({});

	const createQuote = async () => {
		await instance.post('/quotes/', 
			{
				
			}
		)
	}

	return (
		<div className='page-view'>
			
		</div>
	)
}

export default QuoteCreation;
