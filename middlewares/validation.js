// middlewares/validation.js
module.exports = {
  validateCategoryCreate: (req, res, next) => {
    const { name } = req.body;
    const errors = [];
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('name wajib (minimal 2 karakter)');
    }
    if (errors.length) return res.status(400).json({ errors });
    next();
  },

  validateCategoryUpdate: (req, res, next) => {
    // allow partial update; if name provided, validate
    const { name } = req.body;
    const errors = [];
    if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
      errors.push('Jika disertakan, name minimal 2 karakter');
    }
    if (errors.length) return res.status(400).json({ errors });
    next();
  },

  validateMovieCreate: (req, res, next) => {
    const { title, year } = req.body;
    const errors = [];
    if (!title || typeof title !== 'string' || title.trim().length < 1) {
      errors.push('title wajib');
    }
    if (year !== undefined && (!Number.isInteger(year) || year < 2000 || year > 2026)) {
      errors.push('year harus integer valid (opsional) antara tahun 2000 - 2026');
    }
    if (errors.length) return res.status(400).json({ errors });
    next();
  },

  validateMovieUpdate: (req, res, next) => {
    const { title, year } = req.body;
    const errors = [];
    if (title !== undefined && (typeof title !== 'string' || title.trim().length < 1)) {
      errors.push('Jika disertakan, title tidak boleh kosong');
    }
    if (year !== undefined && (!Number.isInteger(year) || year < 2000 || year > 2026)) {
      errors.push('Jika disertakan, year harus integer valid antara tahun 2000 - 2026');
    }
    if (errors.length) return res.status(400).json({ errors });
    next();
  }
};






