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

export {validateQuote}