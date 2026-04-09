export const queryAgent = async (req, res) => {
  const { query, probabilities, teamA, teamB } = req.body;
  
  if (!probabilities || !teamA || !teamB) {
    return res.status(400).json({ reply: 'Please provide match details (teamA, teamB, probabilities) for me to analyze!' });
  }

  const { prob_a, prob_b, implied_total_prob } = probabilities;
  
  // Rule-based smart reasoning
  let response = "";
  
  const qStr = query.toLowerCase();
  
  if (qStr.includes('who will win') || qStr.includes('who should i bet on') || qStr.includes('prediction')) {
    if (prob_a > prob_b + 0.20) {
      response = `Based on my analysis of the ratings, **${teamA}** has a strong advantage here (${(prob_a * 100).toFixed(1)}%). They are the clear favorites!`;
    } else if (prob_b > prob_a + 0.20) {
      response = `The math points heavily towards **${teamB}** winning this one (${(prob_b * 100).toFixed(1)}%). They outclass their opponents in ratings.`;
    } else {
      response = `This is a highly competitive match! It's too close to call with certainty. ${teamA} sits at ${(prob_a * 100).toFixed(1)}% and ${teamB} at ${(prob_b * 100).toFixed(1)}%. It could go either way!`;
    }
  } else if (qStr.includes('odds') || qStr.includes('value')) {
    if (implied_total_prob > 1.05) {
      response = `The bookmakers (or our model) have baked in some margins here (Implied prob = ${(implied_total_prob * 100).toFixed(1)}%). Look for decimal odds that seem overly generous compared to these percentages.`;
    } else {
      response = `The odds look fairly balanced. The decimal values provided exactly reflect the rating probabilities!`;
    }
  } else if (qStr.includes('hello') || qStr.includes('hi')) {
    response = `Hello! I am your Sports Odds Intelligence Assistant. Ask me about who might win the match between ${teamA} and ${teamB}!`;
  } else {
    response = `Hmm, I'm just a simple rule-based AI right now. But looking at ${teamA} vs ${teamB}, the math suggests ${prob_a > prob_b ? teamA : teamB} has the upper hand!`;
  }

  // Add a neon flavor signature
  response += `\n\n🤖 *Intelligence System active.*`;

  // Simulate network delay to make it feel like AI
  setTimeout(() => {
    res.json({ reply: response });
  }, 800);
};
