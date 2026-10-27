const pool = require('../config/db');  // import database
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwt) throw new Error('JWT_SECRET nya belum di set di .env');

const SALT_ROUNDS = 10; //buat bycrpt salt rounds

module.exports = {
    // POST //api/auth/register
    register: async (req, res, next) => {
        try {
            const { email, password, name } = req.body;

            //validasi sederhana
            if (!email || !password) return res.status(400).json({ message: "email dan password wajib" });
            if (password.length < 6) return res.status(400).json({ message: "Password minimal 6 karakter" });

            // cek apakah user sudah ada
            const [existing] = await pool.execute('SELECT id FROM users where email = ?', [email]);
            if (existing.length > 0) {
                return res.status(409).json({ message: "Email sudah terdaftar" });
            }

            //else kalau belum ada, berarti bisa register/insert
            const hashed = await bcrypt.hash(password, SALT_ROUNDS);
            //insert ke tabel users
            const [result] = await pool.execute(
                'INSERT INTO users (email,name,password) VALUES (?,?,?)',
                [email, name || null, hashed]
            )
            const insertedId = result.insertId;
            return res.status(201).json({ id: insertedId, email, name: name || null });



        } catch (error) {
            next(error)
        }
    },

    //POST /api/auth/login
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ message: "Email dan Password Wajib" });

            //ambil data users
            const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (rows.length === 0) return res.status(401).json({ message: "Invalid Credentials" });

            const user = rows[0];

            //bandingkan passwordnya
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ message: "Invalid Credentials" });

            //generate JWT
            const payload = { id: user.id, email: user.email };                 //simpan isi data usernya yang kita ingin sertakan 
            const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });   //membuat token expired dalam 1 jam

            return res.json({
                message: 'Login Berhasil',
                token,
                user: { id: user.id, email: user.email, name: user.name }
            });
        } catch (error) {
            next(error)
        }
    }

}