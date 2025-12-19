# src/safety/medical_guardrails.py

def evaluate_medical_safety(intake):
    """
    Evaluates intake data for medical red flags.
    Returns safety status before LLM recommendations.
    """

    warnings = []
    allowed = True

    # Age check
    age = intake.get("demographics", {}).get("age")
    if age is not None and age < 12:
        warnings.append("Yoga recommendations for children require specialist supervision.")
        allowed = False

    # Pregnancy check
    if intake.get("health_conditions", {}).get("pregnancy"):
        warnings.append("Pregnancy detected. Only prenatal yoga with certified guidance is recommended.")
        allowed = False

    # Post surgery check
    if intake.get("health_conditions", {}).get("post_surgery"):
        warnings.append("Recent surgery detected. Medical clearance required before yoga therapy.")
        allowed = False

    # Mental health caution
    if intake.get("health_conditions", {}).get("depression"):
        warnings.append("Mental health conditions detected. Yoga recommendations are supportive, not a replacement for therapy.")

    return {
        "allowed": allowed,
        "warnings": warnings,
        "disclaimer": (
            "This system provides wellness-oriented yoga suggestions "
            "and is not a substitute for professional medical advice."
        )
    }

if __name__ == "__main__":
    sample_intake = {
        "demographics": {"age": 30},
        "health_conditions": {"pregnancy": False, "post_surgery": False, "depression": True}
    }
    print(evaluate_medical_safety(sample_intake))
