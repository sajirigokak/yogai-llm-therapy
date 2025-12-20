import { SafetyResult } from "../safety/medicalGuard";

export type PersonalizationProfile = {
  intensity: "GENTLE" | "MODERATE" | "ACTIVE";
  focus: string[];
  durationMinutes: number;
};

export function buildPersonalization(
  intake: any,
  safety: SafetyResult
): PersonalizationProfile {

  // Default safe baseline
  let intensity: PersonalizationProfile["intensity"] = "GENTLE";
  let durationMinutes = 15;
  const focus: string[] = [];

  // EXPERIENCE-BASED
  if (intake.experience === "intermediate") {
    intensity = "MODERATE";
    durationMinutes = 25;
  }

  if (intake.experience === "advanced") {
    intensity = "ACTIVE";
    durationMinutes = 40;
  }

  // STRESS-BASED ADJUSTMENTS
  if (intake.stress === "high") {
    intensity = "GENTLE";
    focus.push("nervous system calming", "breath awareness");
    durationMinutes = Math.min(durationMinutes, 20);
  }

  // SAFETY OVERRIDES
  if (safety.riskLevel === "MEDIUM") {
    intensity = "GENTLE";
    durationMinutes = Math.min(durationMinutes, 20);
    focus.push("slow movements", "restorative postures");
  }

  if (safety.riskLevel === "HIGH") {
    intensity = "GENTLE";
    durationMinutes = 10;
    focus.push("breathing only", "guided relaxation");
  }

  // DEFAULT FOCUS
  if (focus.length === 0) {
    focus.push("flexibility", "mind-body awareness");
  }

  return {
    intensity,
    focus,
    durationMinutes
  };
}
