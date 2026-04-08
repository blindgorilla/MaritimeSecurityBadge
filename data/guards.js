/**
 * Mock guard dataset — MS Security Group operators.
 *
 * ─────────────────────────────────────────────────────────────
 * TO INTEGRATE WITH GALAXY API:
 *   Replace the `findGuard` function below with a Galaxy API call.
 *   The rest of the application depends only on `findGuard(query)`
 *   returning an object matching the Guard shape, or null.
 *
 * Guard shape:
 *   {
 *     employeeId:        string   — e.g. "MS1001"
 *     fullName:          string   — e.g. "Iordanis Tzourovrts"
 *     nationality:       string   — e.g. "Greek"
 *     role:              string   — e.g. "Maritime Security Guard"
 *     daysAtSea:         number
 *     missionsCompleted: number
 *     joinYear:          number
 *     badgeNumber:       string   — e.g. "MSB-2015-001"
 *   }
 * ─────────────────────────────────────────────────────────────
 */

const guards = [
  {
    employeeId:        "MS1001",
    fullName:          "Iordanis Tzourovrts",
    nationality:       "Greek",
    role:              "Maritime Security Guard",
    daysAtSea:         1826,
    missionsCompleted: 98,
    joinYear:          2015,
    badgeNumber:       "MSB-2015-001"
  },
  {
    employeeId:        "MS1002",
    fullName:          "Jacobus Johannes Swart",
    nationality:       "South African",
    role:              "Maritime Security Guard",
    daysAtSea:         2139,
    missionsCompleted: 117,
    joinYear:          2013,
    badgeNumber:       "MSB-2013-002"
  },
  {
    employeeId:        "MS1003",
    fullName:          "Konstantinos Bakousis",
    nationality:       "Greek",
    role:              "Maritime Security Guard",
    daysAtSea:         2030,
    missionsCompleted: 109,
    joinYear:          2014,
    badgeNumber:       "MSB-2014-003"
  },
  {
    employeeId:        "MS1004",
    fullName:          "Johannes Jonker Prinsloo",
    nationality:       "South African",
    role:              "Maritime Security Guard",
    daysAtSea:         1353,
    missionsCompleted: 76,
    joinYear:          2017,
    badgeNumber:       "MSB-2017-004"
  },
  {
    employeeId:        "MS1005",
    fullName:          "Theodoros Pantelaios",
    nationality:       "Greek",
    role:              "Maritime Security Guard",
    daysAtSea:         1797,
    missionsCompleted: 97,
    joinYear:          2015,
    badgeNumber:       "MSB-2015-005"
  },
  {
    employeeId:        "MS1006",
    fullName:          "Georgios Stratigopoulos",
    nationality:       "Greek",
    role:              "Maritime Security Guard",
    daysAtSea:         1305,
    missionsCompleted: 71,
    joinYear:          2017,
    badgeNumber:       "MSB-2017-006"
  },
  {
    employeeId:        "MS1007",
    fullName:          "Angelos Tsantis",
    nationality:       "Greek",
    role:              "Maritime Security Guard",
    daysAtSea:         2009,
    missionsCompleted: 108,
    joinYear:          2014,
    badgeNumber:       "MSB-2014-007"
  },
  {
    employeeId:        "MS1008",
    fullName:          "Konstantinos Karampesinis",
    nationality:       "Greek",
    role:              "Maritime Security Guard",
    daysAtSea:         1198,
    missionsCompleted: 64,
    joinYear:          2018,
    badgeNumber:       "MSB-2018-008"
  }
];

/**
 * Find a guard by employee ID or name.
 * This is the single function to replace when connecting to the Galaxy API.
 *
 * Lookup priority:
 *   1. Exact employee ID match  (e.g. "MS1001")
 *   2. Exact full name match    (case-insensitive)
 *   3. Partial name match       (any word starts with query)
 *   4. Substring name match     (name contains query)
 */
function findGuard(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  // 1. Exact employee ID
  let guard = guards.find(g => g.employeeId.toLowerCase() === q);
  if (guard) return guard;

  // 2. Exact full name
  guard = guards.find(g => g.fullName.toLowerCase() === q);
  if (guard) return guard;

  // 3. Any word in the name starts with query (at least 3 chars to avoid noise)
  if (q.length >= 3) {
    guard = guards.find(g =>
      g.fullName.toLowerCase().split(" ").some(part => part.startsWith(q))
    );
    if (guard) return guard;
  }

  // 4. Name contains query (at least 3 chars)
  if (q.length >= 3) {
    guard = guards.find(g => g.fullName.toLowerCase().includes(q));
    if (guard) return guard;
  }

  return null;
}

module.exports = { findGuard, guards };
