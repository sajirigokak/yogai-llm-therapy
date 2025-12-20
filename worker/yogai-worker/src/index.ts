import { medicalSafetyCheck } from "./safety/medicalGuard";
import { buildPersonalization } from "./personalization/engine";

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 });
    }

    try {
      const intake = await request.json();

      // 1️⃣ Run medical safety gate
      const safety = medicalSafetyCheck(intake);

      // ❌ Hard block
      if (!safety.allowed) {
        return new Response(
          JSON.stringify({
            status: "blocked",
            riskLevel: safety.riskLevel,
            warnings: safety.warnings
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      // 2️⃣ Build personalization profile
      const personalization = buildPersonalization(intake, safety);

      // 3️⃣ Call Cloudflare Workers AI
      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          messages: [
            {
              role: "system",
              content: `
You are a certified yoga therapist.
You must ONLY recommend safe yoga asanas and pranayama.
Risk level: ${safety.riskLevel}.
Warnings: ${safety.warnings.join(", ") || "None"}.
Do NOT give medical diagnoses.
`
            },
            {
              role: "user",
              content: `
User profile:
Age: ${intake.age}
Stress: ${intake.stress}
Conditions: ${intake.conditions || "none"}
Experience: ${intake.experience}

Personalization:
Intensity: ${personalization.intensity}
Duration: ${personalization.durationMinutes} minutes
Focus: ${personalization.focus.join(", ")}

Provide a safe, personalized yoga routine.
`
            }
          ]
        }
      );

      // 4️⃣ Final response
      return new Response(
        JSON.stringify({
          status: "ok",
          riskLevel: safety.riskLevel,
          warnings: safety.warnings,
          recommendation: aiResponse.response
        }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500 }
      );
    }
  }
};
