# src/core/intake.py

def collect_user_intake():
    """
    Collects structured user intake data for personalized yoga therapy.
    This data is validated BEFORE being passed to the LLM.
    """

    intake = {
        "demographics": {
            "age": None,
            "sex": None,  # male / female / other
            "country": None
        },
        "health_conditions": {
            "hypertension": False,
            "diabetes": False,
            "asthma": False,
            "thyroid": False,
            "anxiety": False,
            "depression": False,
            "back_pain": False,
            "knee_pain": False,
            "pregnancy": False,
            "post_surgery": False
        },
        "lifestyle": {
            "activity_level": None,  # low / moderate / high
            "sleep_quality": None,   # poor / average / good
            "stress_level": None     # low / medium / high
        },
        "yoga_experience": None  # beginner / intermediate / advanced
    }

    return intake


if __name__ == "__main__":
    intake = collect_user_intake()
    print(intake)
