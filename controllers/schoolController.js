const db = require('../db/connection');

exports.addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body || {};

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ message: 'School added successfully', id: result.insertId });
  });
};

exports.listSchools = (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and Longitude required' });
  }

  const query = `
    SELECT *, 
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) 
      * cos(radians(longitude) - radians(?)) + sin(radians(?)) 
      * sin(radians(latitude)))) AS distance 
    FROM schools 
    ORDER BY distance`;

  db.query(query, [latitude, longitude, latitude], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};
