const pool = require('../config/db');

module.exports = {
    //READ (GET)
    getAll: async (req, res, next) => {
        try {
            const [rows] = await pool.execute(
                `SELECT m.*, c.name AS categoryName 
                FROM movies m 
                LEFT JOIN categories c ON m.categoryId = c.id
                ORDER BY m.id DESC`
            );
            res.json(rows);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            const [rows] = await pool.execute(
                `SELECT m.*, c.name AS categoryName
                FROM movies m
                LEFT JOIN categories c ON categoryId = c.id
                WHERE m.id = `, [id]
            );
            if (rows.length === 0) return res.status(404).json({ message: "Movies tidak di temukan" });
            res.json(rows[0]); //jika movies ada , maka terjadi respon pada rows 1 (index 0)
        } catch (error) {
            next(error)
        }
    },

    //CREATE //protected
    create: async (req, res, next) => {
        try {
            const { title, year, categoryId } = req.body;
            const userId = req.user ? req.user.id : null;

            const [result] = await pool.execute(
                `INSERT INTO movies (title, year, categoryId, userId) VALUES (?,?,?,?)`, [title, year || null, categoryId || null, userId]
            );
            res.status(201).json({ id: result.insertId, title, year: year || null, categoryId: categoryId || null })
        } catch (error) {
            next(error)
        }
    },

    //update/edit // protected
    update: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10);
            const { title, year, categoryId } = req.body;

            const fields = [];
            const values = [];

            if (title !== undefined) { fields.push('title = ?'); values.push(title) };

            if (year !== undefined) { fields.push('year = ?'); values.push(year) };
            if (categoryId !== undefined) { fields.push('categoryId = ?'); values.push(categoryId) };

            if (fields.length === 0) return res.status(400).json({ message: "Nothing to update" })

            values.push(id);

            const sql = `UPDATE movies SET ${fields.join(', ')} WHERE id = ?`

            const [result] = await pool.execute(sql, values);

            if (result.affectedRows === 0) res.status(404).json({ message: "Movie tidak di temukan" });
            res.json({ message: 'Movie berhasil di perbarui' });

        } catch (error) {
            next(error)
        }
    },

    // DELETE //PROTECTED
    remove: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id,10);

            const result = await pool.execute ('DELETE FROM movies WHERE id=?',[id]);
            if (result.affectedRows === 0) res.status(404).json({ message: "Movie tidak di temukan" });
            res.json({ message: 'Movie berhasil di Hapus' });
        } catch (error) {
            next(error)
        }
    }
}