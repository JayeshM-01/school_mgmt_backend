const db = require('../db/connection');

exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body || {};

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: 'School added successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.listSchools = async (req, res) => {
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

  try {
    const [results] = await db.query(query, [latitude, longitude, latitude]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
