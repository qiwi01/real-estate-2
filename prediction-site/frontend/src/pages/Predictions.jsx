import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Star, Calendar, Clock } from 'lucide-react';
import '../css/Predictions.css';

const Predictions = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState('all');
  const location = useLocation();

  // Determine prediction type from URL
  const getPredictionType = () => {
    const path = location.pathname;

    if (path.includes('/today/')) {
      if (path.includes('/win')) return 'today-win';
      if (path.includes('/over15')) return 'today-over15';
      if (path.includes('/over25')) return 'today-over25';
      if (path.includes('/over35')) return 'today-over35';
      if (path.includes('/players')) return 'today-players';
    } else if (path.includes('/top-picks/')) {
      if (path.includes('/win')) return 'top-picks-win';
      if (path.includes('/over15')) return 'top-picks-over15';
      if (path.includes('/over25')) return 'top-picks-over25';
      if (path.includes('/over35')) return 'top-picks-over35';
      if (path.includes('/players')) return 'top-picks-players';
      return 'top-picks';
    } else if (path.includes('/vip')) {
      return 'vip';
    } else {
      if (path.includes('/win')) return 'all-win';
      if (path.includes('/over15')) return 'all-over15';
      if (path.includes('/over25')) return 'all-over25';
      if (path.includes('/over35')) return 'all-over35';
      if (path.includes('/players')) return 'all-players';
    }

    return 'all'; // Default to all predictions
  };

  const predictionType = getPredictionType();

  useEffect(() => {
    fetchPredictions();
  }, [predictionType]);

  useEffect(() => {
    // Filter matches by selected league
    if (selectedLeague === 'all') {
      setFilteredMatches(matches);
    } else {
      setFilteredMatches(matches.filter(match =>
        match.competition?.name === selectedLeague || match.league === selectedLeague
      ));
    }
  }, [matches, selectedLeague]);

  // Get unique leagues from matches
  const getAvailableLeagues = () => {
    const leagues = new Set();
    matches.forEach(match => {
      if (match.competition?.name) {
        leagues.add(match.competition.name);
      } else if (match.league) {
        leagues.add(match.league);
      }
    });
    return Array.from(leagues).sort();
  };

  const fetchPredictions = async () => {
    try {
      // Try to get real matches from TheSportsDB first
      const res = await axios.get('http://localhost:5000/api/matches');
      let matchesData = res.data;

      // Filter matches based on prediction type
      if (predictionType.includes('today-')) {
        // For today's predictions, filter by current date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        matchesData = matchesData.filter(match => {
          const matchDate = new Date(match.utcDate);
          return matchDate >= today && matchDate < tomorrow;
        });
      }

      // Filter by prediction type if specific type is requested
      if (predictionType.includes('-win')) {
        matchesData = matchesData.filter(match =>
          match.predictions && match.predictions.some(pred => pred.type === 'win')
        );
      } else if (predictionType.includes('-over15')) {
        matchesData = matchesData.filter(match =>
          match.predictions && match.predictions.some(pred => pred.type === 'over15')
        );
      } else if (predictionType.includes('-over25')) {
        matchesData = matchesData.filter(match =>
          match.predictions && match.predictions.some(pred => pred.type === 'over25')
        );
      } else if (predictionType.includes('-over35')) {
        matchesData = matchesData.filter(match =>
          match.predictions && match.predictions.some(pred => pred.type === 'over35')
        );
      } else if (predictionType.includes('-players')) {
        matchesData = matchesData.filter(match =>
          match.predictions && match.predictions.some(pred => pred.type === 'player')
        );
      }

      setMatches(matchesData);
    } catch (err) {
      console.log('Failed to load real matches, falling back to predictions:', err);
      try {
        // Fallback to mock predictions if real matches fail
        const fallbackRes = await axios.get('http://localhost:5000/api/predictions');
        setMatches(fallbackRes.data);
      } catch (fallbackErr) {
        console.log(fallbackErr);
        toast.error('Failed to load predictions');
      }
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="predictions-loading">
        <div className="predictions-loading-text">Loading predictions...</div>
      </div>
    );
  }

  // Get header content based on prediction type
  const getHeaderContent = () => {
    switch (predictionType) {
      case 'today-win':
        return {
          title: "Today's Win Predictions",
          subtitle: "AI-powered match winner predictions for today's football matches"
        };
      case 'today-over15':
        return {
          title: "Today's Over/Under 1.5 Goals",
          subtitle: "Matches predicted to have 2 or more goals today"
        };
      case 'today-over25':
        return {
          title: "Today's Over/Under 2.5 Goals",
          subtitle: "Matches predicted to have 3 or more goals today"
        };
      case 'today-over35':
        return {
          title: "Today's Over/Under 3.5 Goals",
          subtitle: "Matches predicted to have 4 or more goals today"
        };
      case 'today-players':
        return {
          title: "Today's Player Predictions",
          subtitle: "AI predictions for player performances and scoring today"
        };
      case 'top-picks':
        return {
          title: "Top Picks",
          subtitle: "Curated selection of our highest confidence predictions"
        };
      case 'top-picks-win':
        return {
          title: "Top Picks - Win Predictions",
          subtitle: "Our highest confidence match winner predictions"
        };
      case 'top-picks-over15':
        return {
          title: "Top Picks - Over/Under 1.5 Goals",
          subtitle: "Our most reliable over/under 1.5 goals predictions"
        };
      case 'top-picks-over25':
        return {
          title: "Top Picks - Over/Under 2.5 Goals",
          subtitle: "Our most reliable over/under 2.5 goals predictions"
        };
      case 'top-picks-over35':
        return {
          title: "Top Picks - Over/Under 3.5 Goals",
          subtitle: "Our most reliable over/under 3.5 goals predictions"
        };
      case 'top-picks-players':
        return {
          title: "Top Picks - Player Predictions",
          subtitle: "Our highest confidence player performance predictions"
        };
      case 'vip':
        return {
          title: "VIP Predictions",
          subtitle: "Premium predictions with enhanced accuracy algorithms"
        };
      case 'all-win':
        return {
          title: "Win Predictions",
          subtitle: "AI-powered match winner predictions for all upcoming matches"
        };
      case 'all-over15':
        return {
          title: "Over/Under 1.5 Goals",
          subtitle: "Matches predicted to have 2 or more goals"
        };
      case 'all-over25':
        return {
          title: "Over/Under 2.5 Goals",
          subtitle: "Matches predicted to have 3 or more goals"
        };
      case 'all-over35':
        return {
          title: "Over/Under 3.5 Goals",
          subtitle: "Matches predicted to have 4 or more goals"
        };
      case 'all-players':
        return {
          title: "Player Predictions",
          subtitle: "AI predictions for player performances and scoring"
        };
      default:
        return {
          title: "AI Predictions",
          subtitle: "Professional predictions powered by advanced algorithms using Poisson distribution modeling, statistical home advantage analysis, and real-time bookmaker odds comparison for maximum accuracy."
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="predictions-container">
      <div className="predictions-header">
        <h1 className="predictions-title">{headerContent.title}</h1>
        <p className="predictions-subtitle">
          {headerContent.subtitle}
        </p>
      </div>

      {/* League Filter */}
      <div className="predictions-filters">
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="predictions-league-select"
        >
          <option value="all">All Leagues</option>
          {getAvailableLeagues().map(league => (
            <option key={league} value={league}>{league}</option>
          ))}
        </select>
      </div>

      {/* Matches Grid */}
      <div className="predictions-grid">
        {filteredMatches.length === 0 ? (
          <div className="predictions-no-matches">
            <div className="predictions-no-matches-icon">⚽</div>
            <h3 className="predictions-no-matches-title">No Matches Available</h3>
            <p className="predictions-no-matches-subtitle">
              There are no matches available for the selected criteria at the moment.
            </p>
          </div>
        ) : (
          filteredMatches.map((match, index) => (
            <div
              key={index}
              className={`predictions-match-card ${match.valueBet ? 'predictions-match-value' : ''}`}
            >
              <div className="predictions-match-content">
                {/* Match Info */}
                <div className="predictions-match-info">
                  <div className="predictions-match-header">
                    <div className="predictions-match-meta">
                      <div className="predictions-match-meta-item">
                        <Calendar className="predictions-match-icon" />
                        <span>{new Date(match.utcDate).toLocaleDateString()}</span>
                      </div>
                      <div className="predictions-match-meta-item">
                        <Clock className="predictions-match-icon" />
                        <span>{new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {match.valueBet && (
                      <div className="predictions-value-badge">
                        <Star className="predictions-value-icon" />
                        <span>VALUE BET</span>
                      </div>
                    )}
                  </div>

                  <div className="predictions-match-teams">
                    <h3 className="predictions-match-teams-title">
                      {match.homeTeam.name} vs {match.awayTeam.name}
                    </h3>
                    <p className="predictions-match-league">{match.competition?.name || 'Premier League'}</p>
                  </div>

                  {/* Team Strengths - Only show for matches with prediction data */}
                  {match.homeStrength && match.awayStrength && (
                    <div className="predictions-strengths">
                      <div className="predictions-strength-item">
                        <div className="predictions-strength-label">Home Strength</div>
                        <div className="predictions-strength-value home">{match.homeStrength}</div>
                      </div>
                      <div className="predictions-strength-item">
                        <div className="predictions-strength-label">Away Strength</div>
                        <div className="predictions-strength-value away">{match.awayStrength}</div>
                      </div>
                    </div>
                  )}

                  {/* Bookmaker Odds */}
                  {match.bookmakerOdds && (
                    <div className="predictions-odds-section">
                      <div className="predictions-odds-label">
                        Bookmaker Odds (<span className="predictions-odds-bookmaker">{match.bookmakerOdds.bookmaker}</span>)
                      </div>
                      <div className="predictions-odds-values">
                        <div className="predictions-odds-item home">
                          <span>1:</span>
                          <span className="predictions-odds-value">{match.bookmakerOdds.home}</span>
                        </div>
                        <div className="predictions-odds-item draw">
                          <span>X:</span>
                          <span className="predictions-odds-value">{match.bookmakerOdds.draw}</span>
                        </div>
                        <div className="predictions-odds-item away">
                          <span>2:</span>
                          <span className="predictions-odds-value">{match.bookmakerOdds.away}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Prediction - Show only relevant prediction based on type */}
                <div className="predictions-prediction-section">
                  {predictionType.includes('-win') && match.predictions?.find(p => p.type === 'win') && (
                    <>
                      <div className="predictions-prediction-display">
                        <div className="predictions-prediction-label">Match Winner Prediction</div>
                        <div className="predictions-prediction-value">{match.predictions.find(p => p.type === 'win').prediction}</div>
                        <div className="predictions-prediction-confidence">{match.predictions.find(p => p.type === 'win').confidence}% Confidence</div>
                      </div>

                      <div className="predictions-prediction-grid">
                        <div className={`predictions-prediction-btn ${match.predictions.find(p => p.type === 'win').prediction === '1' ? 'predictions-prediction-active' : ''}`}>
                          <div className="predictions-prediction-btn-label">HOME</div>
                          <div className="predictions-prediction-btn-confidence">
                            {match.predictions.find(p => p.type === 'win').prediction === '1' ? match.predictions.find(p => p.type === 'win').confidence : '-'}%
                          </div>
                        </div>
                        <div className={`predictions-prediction-btn ${match.predictions.find(p => p.type === 'win').prediction === 'X' ? 'predictions-prediction-active' : ''}`}>
                          <div className="predictions-prediction-btn-label">DRAW</div>
                          <div className="predictions-prediction-btn-confidence">
                            {match.predictions.find(p => p.type === 'win').prediction === 'X' ? match.predictions.find(p => p.type === 'win').confidence : '-'}%
                          </div>
                        </div>
                        <div className={`predictions-prediction-btn ${match.predictions.find(p => p.type === 'win').prediction === '2' ? 'predictions-prediction-active' : ''}`}>
                          <div className="predictions-prediction-btn-label">AWAY</div>
                          <div className="predictions-prediction-btn-confidence">
                            {match.predictions.find(p => p.type === 'win').prediction === '2' ? match.predictions.find(p => p.type === 'win').confidence : '-'}%
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {predictionType.includes('-over15') && match.predictions?.find(p => p.type === 'over15') && (
                    <div className="predictions-prediction-display">
                      <div className="predictions-prediction-label">Over/Under 1.5 Goals</div>
                      <div className="predictions-prediction-value">{match.predictions.find(p => p.type === 'over15').prediction}</div>
                      <div className="predictions-prediction-confidence">{match.predictions.find(p => p.type === 'over15').confidence}% Confidence</div>
                    </div>
                  )}

                  {predictionType.includes('-over25') && match.predictions?.find(p => p.type === 'over25') && (
                    <div className="predictions-prediction-display">
                      <div className="predictions-prediction-label">Over/Under 2.5 Goals</div>
                      <div className="predictions-prediction-value">{match.predictions.find(p => p.type === 'over25').prediction}</div>
                      <div className="predictions-prediction-confidence">{match.predictions.find(p => p.type === 'over25').confidence}% Confidence</div>
                    </div>
                  )}

                  {predictionType.includes('-over35') && match.predictions?.find(p => p.type === 'over35') && (
                    <div className="predictions-prediction-display">
                      <div className="predictions-prediction-label">Over/Under 3.5 Goals</div>
                      <div className="predictions-prediction-value">{match.predictions.find(p => p.type === 'over35').prediction}</div>
                      <div className="predictions-prediction-confidence">{match.predictions.find(p => p.type === 'over35').confidence}% Confidence</div>
                    </div>
                  )}

                  {predictionType.includes('-players') && match.predictions?.find(p => p.type === 'player') && (
                    <div className="predictions-prediction-display">
                      <div className="predictions-prediction-label">Player Prediction</div>
                      <div className="predictions-prediction-value">{match.predictions.find(p => p.type === 'player').prediction}</div>
                      <div className="predictions-prediction-confidence">{match.predictions.find(p => p.type === 'player').confidence}% Confidence</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Predictions;
