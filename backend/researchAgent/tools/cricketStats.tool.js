// researchAgent/tools/cricketStats.tool.js
// A specialized cricket search tool. Instead of a generic search, it builds
// very precise queries targeting cricket stat sites, player profiles, and
// press conference transcripts — the stuff generic search MISSES.

import { webSearchTool } from './webSearch.tool.js';

/**
 * Fetches detailed batting/bowling stats for a player in a specific series/match.
 * Targets HowStat, ESPNcricinfo, and Cricket Archive.
 *
 * @param {string} playerName  - e.g. "Virat Kohli"
 * @param {string} matchContext - e.g. "2019 ICC World Cup"
 */
export const getPlayerStats = async (playerName, matchContext) => {
  // We build a very targeted search query — not just "Kohli stats"
  // but specifically asking stat-heavy sources
  const query = `${playerName} stats ${matchContext} cricinfo site:stats.espncricinfo.com OR site:howstat.com`;
  return webSearchTool(query, false, 4);
};


/**
 * Fetches player pre-match form — how they were performing in the 3-4 matches
 * BEFORE the main event. This is the "context" casual viewers miss.
 *
 * @param {string} playerName   - e.g. "Ben Stokes"
 * @param {string} priorPeriod  - e.g. "3 matches before 2019 World Cup Final"
 */
export const getPreMatchForm = async (playerName, priorPeriod) => {
  const query = `${playerName} form ${priorPeriod} recent performances innings scores`;
  return webSearchTool(query, false, 4);
};


/**
 * Searches for verified player quotes, press conference statements,
 * and post-match reactions. Much richer than generic news.
 *
 * @param {string} playerOrPersonName - e.g. "Eoin Morgan"
 * @param {string} matchContext - e.g. "after 2019 World Cup Final"
 */
export const getPlayerQuotes = async (playerOrPersonName, matchContext) => {
  const query = `"${playerOrPersonName}" quotes press conference statement interview ${matchContext}`;
  return webSearchTool(query, false, 4);
};


/**
 * Fetches match conditions: pitch report, weather, ground stats,
 * curator's pitch assessment — things that heavily affect the game narrative.
 *
 * @param {string} venue     - e.g. "Lord's Cricket Ground"
 * @param {string} matchDate - e.g. "July 14 2019"
 */
export const getMatchConditions = async (venue, matchDate) => {
  const query = `${venue} pitch report weather conditions ${matchDate} cricinfo`;
  return webSearchTool(query, false, 3);
};
