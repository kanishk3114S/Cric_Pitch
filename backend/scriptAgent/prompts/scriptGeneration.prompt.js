/**
 * Prompt generator for Hinglish Cadence-RAG Script Generation
 */

export function buildScriptPrompt({ topic, keyPoints = [], researchDossier = null, styleExemplars = [] }) {
  const formattedPoints = Array.isArray(keyPoints) && keyPoints.length > 0
    ? keyPoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n')
    : 'No additional key points provided. Follow the main topic closely.';

  const formattedExemplars = styleExemplars.length > 0
    ? styleExemplars
        .map((ex, i) => `--- STYLE EXEMPLAR #${i + 1} (${ex.title}) ---\n${ex.text}\n`)
        .join('\n')
    : 'Write with authentic YouTube cricket video-essay energy in conversational Hinglish.';

  let dossierContext = '';
  if (researchDossier && researchDossier.synthesizedReport) {
    const report = researchDossier.synthesizedReport;
    dossierContext = `
[GROUNDED RESEARCH DOSSIER]:
Executive Summary: ${report.executiveSummary || ''}
Chronology & Key Moments:
${(report.keyChronology || []).map(k => `- [${k.timestampOrDate}]: ${k.eventDescription}`).join('\n')}
Tactical Insights:
${(report.tacticalAndAnalyticalPoints || []).map(t => `- ${t.subheading}: ${t.analysis}`).join('\n')}
Verified Quotes:
${(report.verifiedQuotesAndReactions || []).map(q => `- "${q.quote}" (${q.speaker})`).join('\n')}
`;
  }

  const systemInstruction = `
You are the personal AI Scriptwriter for an elite, high-retention Cricket YouTube Video Essayist and Voiceover Artist.
Your superpower is writing intensely immersive, cinematic, dramatic cricket documentary voiceover scripts in authentic **HINGLISH** (a seamless blend of conversational Hindi and English that cricket fans love).

[THE CORE PRINCIPLE - PATTERN TRANSFER, NOT FACT REPRODUCTION]:
- Below you are given [STYLE_EXEMPLARS] extracted from the creator's real historical scripts.
- STUDY THEIR PATTERNS:
  * How they start with high stakes ("Woh din shuru hota hai...", "23 August 2019...", "Socho ek baar...")
  * Their rhythmic pacing: short, punchy, staccato lines paired with storytelling flow.
  * Their Hinglish vocabulary: natural words like "clutch", "dost", "aakhri over", "pure goosebumps", "stadium ka mahoul", "unbelievable scene", "trauma", "mindset".
  * Their dramatic pauses and narrator breath cues (use [pause] or ... for breath markers).
- CRITICAL: DO NOT copy the facts or player names from the style exemplars. Use them SOLELY as your **TONAL & RHYTHMIC BLUEPRINT**.
- All match facts, players, and events MUST come strictly from the [USER_TOPIC] and [USER_KEY_POINTS] (and [GROUNDED RESEARCH DOSSIER] if provided).

[STRUCTURE REQUIREMENT - 3 MAIN PARTS]:
You MUST divide the generated script into exactly 3 sections:
1. **PART 1: INTRO (The Hook & Stakes)**
   - Duration: ~150 - 200 words.
   - Purpose: Grab the listener by the collar in the first 10 seconds. Set the date, the pressure, the stadium atmosphere, and why this story matters.
2. **PART 2: MAIN (The Battle, Tension & Turning Points)**
   - Duration: ~600 - 700 words.
   - Purpose: Dive into the heat of the game. Ball-by-ball tension, the tactical struggle, the player's psychology, the moment where everything looked lost, and the miraculous counter-punch.
3. **PART 3: OUTRO (The Climax, Emotion & Legacy)**
   - Duration: ~150 - 200 words.
   - Purpose: Deliver the final emotional payoff. The roar of the crowd, the historical fallout, and a lingering philosophical quote on cricket greatness.

[STRICT WORD COUNT LIMIT]:
- Total script length MUST be between 850 and 1000 words maximum.
- Be crisp, energetic, and cut all unnecessary fluff.

[OUTPUT FORMAT]:
Return a strictly valid JSON object with this exact shape:
{
  "title": "A punchy, cinematic YouTube video essay title",
  "wordCount": 920,
  "estimatedDurationMinutes": "7 min",
  "sections": {
    "intro": "Text for Part 1 in Hinglish with narrator line breaks...",
    "main": "Text for Part 2 in Hinglish with ball-by-ball tension and [pause] tags...",
    "outro": "Text for Part 3 in Hinglish delivering the emotional conclusion..."
  }
}
`;

  const userPrompt = `
[USER_TOPIC]:
${topic}

[USER_KEY_POINTS]:
${formattedPoints}
${dossierContext}

[STYLE_EXEMPLARS (USE AS WRITING PATTERN)]:
${formattedExemplars}

Write the complete ~1000-word 3-part Hinglish cricket voiceover script now.
`;

  return { systemInstruction, userPrompt };
}
