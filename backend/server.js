const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(express.json());
app.use(cors());

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
            else {
                res.json(rows);
            }
        }
    );
});

// post
app.post('/api/quotes', (req, res) => {
    const quote = req.body;
    
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
            quote.created_at
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
            created_at = ?
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
            updQuote.created_at,
            id
        ],
        function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }
            else {
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
                return res.status(200).json({ message: 'Quote deleted.' });
            }
        }
    );
});

app.listen(3000, () => console.log(`Server running on 3000.`));
