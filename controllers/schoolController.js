const db = require("../db");

// Add a new school
const addSchool = (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // basic validation
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const sql =
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, address, latitude, longitude], (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({
          success: false,
          message: "Something went wrong while adding school",
        });
      }

      return res.status(201).json({
        success: true,
        message: "School added successfully",
        id: result.insertId,
      });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  addSchool,
};

// calculate distance (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// get schools sorted by distance
const listSchools = (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: "Latitude and longitude are required",
    });
  }

  db.query("SELECT * FROM schools", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error fetching schools",
      });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const schoolsWithDistance = results.map((school) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );

      return {
        ...school,
        distance: Number(distance.toFixed(2)),
      };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      data: schoolsWithDistance,
    });
  });
};

module.exports = {
  addSchool,
  listSchools,
};