/**
 * Vercel serverless function — GET /api/guard?query=<id_or_name>
 *
 * This file is the Vercel-compatible equivalent of routes/api.js.
 * server.js + routes/api.js are kept for local development with Express.
 */

const { findGuard } = require("../data/guards");

module.exports = function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const query = req.query.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  const guard = findGuard(query);

  if (!guard) {
    return res.status(404).json({
      error: "No guard found. Please check your employee ID or name."
    });
  }

  res.json({
    employeeId:        guard.employeeId,
    fullName:          guard.fullName,
    nationality:       guard.nationality,
    role:              guard.role,
    daysAtSea:         guard.daysAtSea,
    missionsCompleted: guard.missionsCompleted,
    joinYear:          guard.joinYear,
    badgeNumber:       guard.badgeNumber,
    company:           "MS Security Group"
  });
};
