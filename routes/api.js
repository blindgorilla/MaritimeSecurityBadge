const express = require("express");
const router = express.Router();
const { findGuard } = require("../data/guards");

// GET /api/guard?query=<employee_id_or_email>
router.get("/guard", (req, res) => {
  const query = req.query.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  const guard = findGuard(query);

  if (!guard) {
    return res.status(404).json({ error: "No guard found with that ID or email address." });
  }

  // Return only the fields needed for the badge (never expose internal data)
  res.json({
    id: guard.id,
    name: guard.name,
    role: guard.role,
    daysAtSea: guard.daysAtSea,
    missionsCompleted: guard.missionsCompleted,
    joinYear: guard.joinYear,
    badgeNumber: guard.badgeNumber,
    company: "MS Security Group"
  });
});

module.exports = router;
