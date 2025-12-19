# src/llm/prompt_templates.py

def build_yoga_therapy_prompt(intake, safety):
    """
    Builds a structured, safety-aware prompt for personalized yoga therapy.
    """

    system_prompt = (
        "You are a certified yoga therapist AI. "
        "You provide wellness-focused yoga and pranayama guidance only. "
        "You do NOT diagnose diseases, prescribe treatments, or replace medical professionals."
    )

    constraints = (
        "Constraints:\n"
        "- Do not provide medical diagnoses.\n"
        "- Avoid claims of curing diseases.\n"
        "- Be gentle and conservative in recommendations.\n"
        "- If unsure, recommend professional consultation.\n"
    )

    user_context = f"""
User Profile:
- Age: {intake['demographics'].get('age')}
- Sex: {intake['demographics'].get('sex')}
- Yoga Experience: {intake.get('yoga_experience')}
- Health Conditions: {', '.join([k for k, v in intake['health_conditions'].items() if v]) or 'None'}
- Lifestyle: {intake.get('lifestyle')}
"""

    output_format = (
        "Respond in JSON with the following structure:\n"
        "{\n"
        "  'recommended_asanas': [list of gentle yoga poses],\n"
        "  'recommended_pranayama': [list of breathing techniques],\n"
        "  'precautions': [list of precautions],\n"
        "  'frequency': 'suggested weekly frequency',\n"
        "  'disclaimer': 'short safety disclaimer'\n"
        "}"
    )

    full_prompt = (
        system_prompt + "\n\n" +
        constraints + "\n\n" +
        user_context + "\n\n" +
        output_format
    )

    return full_prompt
