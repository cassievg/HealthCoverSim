const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(express.json());
app.use(cors());

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

    if (!nameRegex.test(quote.customer_name)) {
        return 'Customer name contains invalid characters.';
    }

    
    const validCoverTypes = ['single', 'couple', 'family'];

    if (!validCoverTypes.includes(quote.cover_type)) {
        return 'Cover type is invalid.';
    }

    
    if (
        !Number.isInteger(quote.applicant1_age) ||
        quote.applicant1_age < 18 ||
        quote.applicant1_age > 100
    ) {
        return 'Age 1 must be a number between 18-100.';
    }


    const validCoverHistory = ['yes', 'no', 'not sure'];

    if (!validCoverHistory.includes(quote.applicant1_cover_history)) {
        return 'Cover history 1 is invalid.';
    }


    if (quote.cover_type === 'single') {
        if (
            quote.applicant2_age !== null ||
            quote.applicant2_cover_history !== null
        ) {
            return 'Applicant 2 details must be null for cover type single.';
        }
    } else {
        if (
            quote.applicant2_age === null ||
            quote.applicant2_cover_history === null
        ) {
            return 'Applicant 2 details are required for cover type couple and family.';
        }

        if (
            !Number.isInteger(quote.applicant2_age) ||
            quote.applicant2_age < 18 ||
            quote.applicant2_age > 100
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


    if (
        !Number.isInteger(quote.annual_discount) ||
        quote.annual_discount < 0 ||
        quote.annual_discount > 10
    ) {
        return 'Annual discount must be a number between 0-10.';
    }

    if (
        quote.payment_frequency === 'monthly' &&
        quote.annual_discount !== 0
    ) {
        return 'Annual discount must be 0 for monthly payment.';
    }


    if (
        quote.notes !== null  &&
        quote.notes !== undefined &&
        typeof quote.notes !== 'string'
    ) {
        return 'Notes must be string.'
    }


    return null;
}

// get all
app.get('/api/quotes', (req, res) => {
    db.all(
        `SELECT * from quotes`, [],
        (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }
            
            res.json(rows);
        }
    );
});

// get by id
app.get('/api/quotes/:id', (req, res) => {
    const { id } = req.params;

    db.get(
        `SELECT * from quotes WHERE id = ?`,
        [id],
        (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }
            
            if (!rows) {
                return res.status(404).json({ error: 'Quote not found.' });
            }

            res.json(rows);
        }
    );
});

// post
app.post('/api/quotes', (req, res) => {
    const quote = req.body;

    const validateError = validateQuote(quote);

    if (validateError) {
        return res.status(400).json({ error: validateError });
    }

    const createdAt = new Date().toISOString();

    db.run(
        `INSERT INTO quotes
        (
        customer_name,
        cover_type,
        applicant1_age,
        applicant1_cover_history,
        applicant2_age,
        applicant2_cover_history,
        hospital_cover,
        extras_cover,
        payment_frequency,
        annual_discount,
        notes,
        created_at
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            quote.customer_name,
            quote.cover_type,
            quote.applicant1_age,
            quote.applicant1_cover_history,
            quote.applicant2_age,
            quote.applicant2_cover_history,
            quote.hospital_cover,
            quote.extras_cover,
            quote.payment_frequency,
            quote.annual_discount,
            quote.notes,
            createdAt
        ],
        function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }
            else {
                return res.status(201).json({ id: this.lastID });
            }
        }
    );
});

// put by id
app.put('/api/quotes/:id', (req, res) => {
    const { id } = req.params;

    const updQuote = req.body;

    const validateError = validateQuote(updQuote);

    if (validateError) {
        return res.status(400).json({ error: validateError });
    }

    db.run(
        `UPDATE quotes
        SET
            customer_name = ?,
            cover_type = ?,
            applicant1_age = ?,
            applicant1_cover_history = ?,
            applicant2_age = ?,
            applicant2_cover_history = ?,
            hospital_cover = ?,
            extras_cover = ?,
            payment_frequency = ?,
            annual_discount = ?,
            notes = ?,
        WHERE id = ?
        `,
        [
            updQuote.customer_name,
            updQuote.cover_type,
            updQuote.applicant1_age,
            updQuote.applicant1_cover_history,
            updQuote.applicant2_age,
            updQuote.applicant2_cover_history,
            updQuote.hospital_cover,
            updQuote.extras_cover,
            updQuote.payment_frequency,
            updQuote.annual_discount,
            updQuote.notes,
            id
        ],
        function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }
            else {
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Quote not found.' });
                }

                return res.status(200).json({ ...updQuote});
            }
        }
    );
});

// delete by id
app.delete('/api/quotes/:id', (req, res) => {
    const { id } = req.params;

    db.run(
        `DELETE FROM quotes
        WHERE id = ?`,
        [id],
        function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }
            else {
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Quote not found.' });
                }
                
                return res.status(200).json({ message: 'Quote deleted.' });
            }
        }
    );
});

app.listen(3000, () => console.log(`Server running on 3000.`));
