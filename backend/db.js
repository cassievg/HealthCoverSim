const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./hcs_database.db');

db.run(`
    CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        cover_type TEXT CHECK (cover_type IN ('single', 'couple', 'family')) NOT NULL,
        applicant1_age INTEGER CHECK (typeof(applicant1_age) = 'integer' AND applicant1_age BETWEEN 18 AND 100) NOT NULL,
        applicant1_cover_history TEXT CHECK (applicant1_cover_history IN ('yes', 'no', 'not sure')) NOT NULL,
        applicant2_age INTEGER CHECK (typeof(applicant2_age) = 'integer' AND applicant2_age BETWEEN 18 AND 100),
        applicant2_cover_history TEXT CHECK (applicant2_cover_history IN ('yes', 'no', 'not sure')),
        hospital_cover TEXT CHECK (hospital_cover IN ('none', 'basic', 'bronze', 'silver', 'gold')) NOT NULL,
        extras_cover TEXT CHECK (extras_cover IN ('none', 'basic', 'standard', 'premium')) NOT NULL,
        payment_frequency TEXT CHECK (payment_frequency IN ('monthly', 'yearly')) NOT NULL,
        annual_discount INTEGER CHECK (typeof(annual_discount) = 'integer' AND annual_discount BETWEEN 0 AND 10),
        notes TEXT,
        created_at TEXT NOT NULL
    )
`);

module.exports = db;
