/**
 * Mock guard data for development.
 * Replace this module with a Galaxy API client when integrating with the real system.
 *
 * Expected API contract:
 *   findGuard(query: string) => Promise<Guard | null>
 *
 * Guard shape:
 *   { id, email, name, role, daysAtSea, missionsCompleted, joinYear, badgeNumber }
 */

const guards = [
  {
    id: "MSG-001",
    email: "james.carter@mssecurity.com",
    name: "James Carter",
    role: "Senior Maritime Security Guard",
    daysAtSea: 1247,
    missionsCompleted: 89,
    joinYear: 2018,
    badgeNumber: "MSB-2018-001"
  },
  {
    id: "MSG-002",
    email: "sarah.okafor@mssecurity.com",
    name: "Sarah Okafor",
    role: "Maritime Security Guard",
    daysAtSea: 634,
    missionsCompleted: 41,
    joinYear: 2021,
    badgeNumber: "MSB-2021-002"
  },
  {
    id: "MSG-003",
    email: "rafael.santos@mssecurity.com",
    name: "Rafael Santos",
    role: "Maritime Security Team Leader",
    daysAtSea: 2103,
    missionsCompleted: 156,
    joinYear: 2015,
    badgeNumber: "MSB-2015-003"
  },
  {
    id: "MSG-004",
    email: "nina.petrov@mssecurity.com",
    name: "Nina Petrov",
    role: "Maritime Security Guard",
    daysAtSea: 312,
    missionsCompleted: 18,
    joinYear: 2023,
    badgeNumber: "MSB-2023-004"
  },
  {
    id: "MSG-005",
    email: "kwame.asante@mssecurity.com",
    name: "Kwame Asante",
    role: "Senior Maritime Security Guard",
    daysAtSea: 987,
    missionsCompleted: 67,
    joinYear: 2019,
    badgeNumber: "MSB-2019-005"
  },
  {
    id: "MSG-006",
    email: "lisa.chen@mssecurity.com",
    name: "Lisa Chen",
    role: "Maritime Security Guard",
    daysAtSea: 445,
    missionsCompleted: 29,
    joinYear: 2022,
    badgeNumber: "MSB-2022-006"
  }
];

/**
 * Find a guard by employee ID or email address.
 * This is the single function to replace when connecting to the Galaxy API.
 */
function findGuard(query) {
  const q = query.trim().toLowerCase();
  const guard = guards.find(
    g => g.id.toLowerCase() === q || g.email.toLowerCase() === q
  );
  return guard || null;
}

module.exports = { findGuard };
