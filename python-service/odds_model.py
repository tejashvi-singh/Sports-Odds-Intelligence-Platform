def calculate_odds(team_a_rating: float, team_b_rating: float):
    """
    Very simple rating-based probability model.
    Higher rating = higher probability of winning.
    """
    total_rating = team_a_rating + team_b_rating
    
    if total_rating == 0:
        prob_a = 0.5
        prob_b = 0.5
    else:
        # A simple weight calculation
        prob_a = team_a_rating / total_rating
        prob_b = team_b_rating / total_rating
        
    # We add a slight draw probability to make things interesting (let's say 10%)
    # and re-adjust
    draw_prob = 0.10
    adjusted_prob_a = prob_a * (1 - draw_prob)
    adjusted_prob_b = prob_b * (1 - draw_prob)
    
    # Calculate decimal odds (Odds = 1 / Probability)
    # The higher the probability, the lower the decimal odds
    # We cap at 99.0 for super low probabilities
    odds_a = round(1 / adjusted_prob_a, 2) if adjusted_prob_a > 0.01 else 99.0
    odds_b = round(1 / adjusted_prob_b, 2) if adjusted_prob_b > 0.01 else 99.0
    odds_draw = round(1 / draw_prob, 2)
    
    return {
        "prob_a": round(adjusted_prob_a, 4),
        "prob_b": round(adjusted_prob_b, 4),
        "prob_draw": round(draw_prob, 4),
        "odds_a": odds_a,
        "odds_b": odds_b,
        "odds_draw": odds_draw,
        "implied_total_prob": round(adjusted_prob_a + adjusted_prob_b + draw_prob, 4)
    }
