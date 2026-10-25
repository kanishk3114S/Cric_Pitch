// researchAgent/tools/toolRegistry.js
// The "toolbox". This is just a clean object that registers all our tools
// so the agent can look them up by name and call them.
// Think of it like a menu — the agent picks what tool it needs.

import { webSearchTool } from './webSearch.tool.js';
import {
  getPlayerStats,
  getPreMatchForm,
  getPlayerQuotes,
  getMatchConditions,
} from './cricketStats.tool.js';

export const toolRegistry = {
  // Generic web search — fallback for anything not covered by cricket tools
  webSearch: webSearchTool,

  // Specialized cricket tools
  getPlayerStats,    // HowStat / Cricinfo stats for a specific series
  getPreMatchForm,   // How player was performing BEFORE the match
  getPlayerQuotes,   // Verified player / coach quotes from press conferences
  getMatchConditions,// Pitch report, weather, ground history
};
