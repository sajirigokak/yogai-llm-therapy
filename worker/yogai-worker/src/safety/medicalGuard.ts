export type SafetyResult = {
  allowed: boolean;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  warnings: string[];
};

export function medicalSafetyCheck(intake: any): SafetyResult {
  const warnings: string[] = [];

  // HARD BLOCKS
  if (intake.age < 14) {
    return {
      allowed: false,
      riskLevel: "HIGH",
      warnings: ["User is a minor. Adult supervision required."]
    };
  }

  if (intake.pregnant === true) {
    return {
      allowed: false,
      riskLevel: "HIGH",
      warnings: ["Pregnancy detected. Yoga therapy must be supervised."]
    };
  }

  if (intake.recentSurgery === true) {
    return {
      allowed: false,
      riskLevel: "HIGH",
      warnings: ["Recent surgery detected. Medical clearance required."]
    };
  }

  // SOFT WARNINGS
  if (intake.conditions?.includes("chronic_pain")) {
    warnings.push("Chronic pain detected. Avoid intense postures.");
  }

  if (intake.stress === "high") {
    warnings.push("High stress levels detected. Focus on calming practices.");
  }

  return {
    allowed: true,
    riskLevel: warnings.length > 0 ? "MEDIUM" : "LOW",
    warnings
  };
}
