import { AnalysisResult } from "../types";

// The Gemini call now happens on the server (see server/index.ts) so the API
// key is never shipped to the browser. This client just talks to our own
// /api/analyze endpoint.
export const analyzeProblem = async (problemDescription: string): Promise<AnalysisResult> => {
  let response: Response;
  try {
    response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem: problemDescription })
    });
  } catch (e: any) {
    throw new Error(`Could not reach the analysis service: ${e?.message || e}`);
  }

  if (!response.ok) {
    let message = `Analysis failed (HTTP ${response.status}).`;
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
      // Response body wasn't JSON; keep the generic status message.
    }
    throw new Error(message);
  }

  try {
    return (await response.json()) as AnalysisResult;
  } catch {
    throw new Error("Invalid response format from the analysis service.");
  }
};
