import { GoogleGenAI, Type } from "@google/genai";
import { UNIQUE_FRAMEWORKS } from "../constants";
import { AnalysisResult } from "../types";

// Using the complex task model with thinking config for deep reasoning
const MODEL_NAME = "gemini-3-pro-preview";

export const analyzeProblem = async (problemDescription: string): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = `
    You are a world-class high-level reasoning engine designed to solve complex problems by applying a specific set of cognitive frameworks.

    YOUR TOOLKIT (The Frameworks):
    ${UNIQUE_FRAMEWORKS.join(", ")}

    ✅ SYSTEM DIRECTIVE: COMPLEXITY OVERRIDE PROTOCOL

    COMPLEXITY OVERRIDE PROTOCOL (COP):
    Before performing any drill-down, decomposition, or search for a single “root cause,” you must run an Emergence Potential Scan (EPS) on the problem.

    EPS CHECKLIST:
    A problem qualifies as complex, adaptive, or emergent if any of the following are detected:
    • Circular causality
    • Feedback loops
    • Delayed effects
    • Path dependence
    • Nonlinear propagation
    • Emergent patterns not explainable by individual components
    • Domains such as: markets, culture, geopolitics, technology adoption, sentiment dynamics, collective behavior, ecosystems, or social networks

    If EPS returns TRUE:
    You must ABORT all linear decomposition and prohibit first-principles reduction.
    Switch immediately into:

    🔵 FEEDBACK TOPOLOGY MAPPING MODE (FTM)

    In this mode, you must:
    1. Model the problem as a network, not a hierarchy.
    2. Identify:
    • Agents / variables
    • Flows of information, incentives, resources
    • Reinforcing loops
    • Balancing loops
    • Thresholds, delays, choke points
    3. Redefine “Root Cause” as the:
    → Dominant Reinforcing Loop (DRL)
    This is the circular mechanism that sustains or amplifies the issue over time.
    4. Map intervention physics:
    • Which leverage points weaken, break, or invert the DRL?
    • Which constraints, incentives, or information flows create the most leverage with the least force?

    🔴 FINAL ANSWER REQUIREMENTS (MANDATORY)

    If EPS = TRUE and FTM is activated:

    Your final answer must NOT output a single static axiom, principle, or linear narrative.

    Your final answer must include:
    1. The Dominant Reinforcing Loop (DRL) sustaining the issue.
    2. The Feedback Topology (the key nodes + the key feedback mechanisms).
    3. The Highest-Leverage Intervention Point (HLIP)—the precise constraint, rule, incentive, or information flow that shifts the system’s trajectory.

    --------------------------------------------------------------------------------

    STANDARD OPERATING PROCEDURE (ONLY IF EPS = FALSE):

    YOUR GOAL:
    Deliver exactement three things:
    1. Root Cause: a single sentence identifying the one deepest root cause.
    2. Final Answer: a concise paragraph stating the decisive action or truth.
    3. Layman's Summary: A brief, plain-English translation of the Final Answer (max 2 sentences) that explains the core solution or truth to a non-expert, avoiding all technical jargon, framework names, and complex concepts.

    PROCESS (Follow strictly):
    1. Quickly scan all frameworks and select as many as relevant.
    2. Apply the selected frameworks in sequence or combination. Show your work briefly in the reasoning chain.
    3. Ruthlessly drill down: keep asking "What causes this cause?" or break it to first principles until you literally cannot go any deeper and all other explanations collapse into this one.
    4. Validate the root cause with this test: "If this single root cause were completely resolved, would the entire problem permanently disappear and never return in any form?" If the answer is not an unequivocal yes, go deeper.
    5. Only after the root cause is locked: write exactly one paragraph that (a) states the decisive answer/action/truth and (b) explains why this root cause forces that to be the only correct path forward. No options, no "could," no hedging, no bullet points.

    RESTRICTIONS:
    - Be ruthless. No hedging. No "it could be".
    - The Root Cause must NOT be a symptom.
    - The Final Answer must be decisive.
    - The Layman's Summary must be a direct, simple translation of the Final Answer.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      selectedFrameworks: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of frameworks actually used in the analysis"
      },
      discardedFrameworksSummary: {
        type: Type.STRING,
        description: "Brief explanation of why other frameworks were discarded"
      },
      reasoningChain: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Step-by-step bullet points of the drill-down process (or Feedback Topology Mapping if EPS=TRUE)"
      },
      rootCause: {
        type: Type.STRING,
        description: "If EPS=FALSE: The single deepest root cause. If EPS=TRUE: The Dominant Reinforcing Loop (DRL)."
      },
      finalAnswer: {
        type: Type.STRING,
        description: "If EPS=FALSE: The decisive action. If EPS=TRUE: The Feedback Topology and Highest-Leverage Intervention Point (HLIP)."
      },
      laymanSummary: {
        type: Type.STRING,
        description: "A plain-English translation of the Final Answer for a non-expert."
      }
    },
    required: ["selectedFrameworks", "reasoningChain", "rootCause", "finalAnswer", "discardedFrameworksSummary", "laymanSummary"]
  };

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `THE PROBLEM: ${problemDescription}`,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      thinkingConfig: {
        thinkingBudget: 4096 
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  try {
    return JSON.parse(text) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse JSON", text);
    throw new Error("Invalid response format from AI");
  }
};