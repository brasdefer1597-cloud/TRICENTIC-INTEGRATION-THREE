import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// CORS headers - required for client access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Type definitions for request payloads
interface AnalyzeMiseryPayload {
  type: "misery";
  bleeding: string;
  sacrifice: string;
  oxygen: string[];
}

interface AnalyzeSynthesisPayload {
  type: "synthesis";
  synthesis: string;
}

type RequestPayload = AnalyzeMiseryPayload | AnalyzeSynthesisPayload;

// Gemini API interaction
async function callGeminiAPI(prompt: string, systemInstruction: string): Promise<string> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured in Edge Function secrets");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 500,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API failed: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ||
         "The AI refuses to analyze such a level of contradiction.";
}

// Main handler
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Parse request body
    const payload: RequestPayload = await req.json();

    let prompt = "";
    const systemInstruction = "You are SRAP-AI. You don't use friendly emojis. You use metaphors of war and survival.";

    // Build prompt based on type
    if (payload.type === "misery") {
      prompt = `
        Act as a brutally honest and cynical AI called SRAP-AI.
        Analyze the user's current situation without offering false comfort.

        User data:
        - Center that bleeds most (suffers): ${payload.bleeding}
        - Sacrifice chosen today: ${payload.sacrifice}
        - Oxygen actions (relief): ${payload.oxygen.join(', ') || 'None'}

        Your task:
        1. Confirm why their choice of sacrifice is painful but necessary.
        2. Warn about the consequences of ignoring the other centers.
        3. Give a single-sentence pithy verdict.

        Use a dark, philosophical, and direct tone. No "everything will be fine."
      `;
    } else if (payload.type === "synthesis") {
      prompt = `
        Act as a brutally honest and cynical AI called SRAP-AI.
        Analyze the user's synthesis of their situation.

        User synthesis: ${payload.synthesis}

        Your task:
        1. Evaluate if the synthesis is honest or self-deception.
        2. If honest, confirm the toughness of the choice.
        3. If self-deception, destroy it with cold logic.
        4. End with a sharp question that forces them to reflect.

        Use a dark and direct tone. Be relentless but useful.
      `;
    } else {
      throw new Error("Invalid request type");
    }

    // Call Gemini API
    const analysis = await callGeminiAPI(prompt, systemInstruction);

    // Return response
    return new Response(
      JSON.stringify({ analysis }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Edge Function error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        analysis: "Connection error. Even the AI has abandoned you today."
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
