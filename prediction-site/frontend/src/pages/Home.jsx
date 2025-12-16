import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import { TrendingUp, Target, Users, Zap, Star, Calendar, Clock } from 'lucide-react';
import '../css/Home.css';

const Home = () => {
  const [featuredMatches, setFeaturedMatches] = useState([]);
  const [todaysMatches, setTodaysMatches] = useState([]);
  const [outcomes, setOutcomes] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    // Get real matches from TheSportsDB
    axios.get('http://localhost:5000/api/matches')
      .then(res => {
        setFeaturedMatches(res.data.slice(0, 6));
        // Filter for today's matches
        const today = new Date().toDateString();
        const todayMatches = res.data.filter(match =>
          new Date(match.utcDate).toDateString() === today
        );
        setTodaysMatches(todayMatches);
      })
      .catch(err => {
        console.log('Error loading matches, falling back to predictions:', err);
        // Fallback to predictions API if matches API fails
        axios.get('http://localhost:5000/api/predictions')
          .then(res => {
            setFeaturedMatches(res.data.slice(0, 6));
            const today = new Date().toDateString();
            const todayMatches = res.data.filter(match =>
              new Date(match.utcDate).toDateString() === today
            );
            setTodaysMatches(todayMatches);
          })
          .catch(err => console.log(err));
      });

    // Get outcomes (past predictions)
    axios.get('http://localhost:5000/api/outcomes?days=7')
      .then(res => setOutcomes(res.data))
      .catch(err => console.log(err));


  }, [user]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-title">
            OddsEdge
          </h1>

          <p className="home-subtitle">
            Professional Football Prediction Platform
          </p>

          <p className="home-description">
            Powered by advanced AI algorithms using Poisson distribution, statistical modeling,
            and real-time bookmaker odds to deliver the most accurate predictions in football betting.
          </p>

          <div className="home-cta-buttons">
            <Link to="/predictions" className="home-cta-primary">
              <span className="home-cta-content">
                <span>View Predictions</span>
                <TrendingUp className="home-cta-icon" />
              </span>
            </Link>
            {!user && (
              <Link to="/register" className="home-cta-secondary">
                Join Free
              </Link>
            )}
          </div>

          {/* Stats Bar */}
          <div className="home-stats-bar">
            <div className="home-stat-item">
              <div className="home-stat-number">95%</div>
              <div className="home-stat-label">Prediction Accuracy</div>
            </div>
            <div className="home-stat-item">
              <div className="home-stat-number">24/7</div>
              <div className="home-stat-label">Live Updates</div>
            </div>
            <div className="home-stat-item">
              <div className="home-stat-number">50K+</div>
              <div className="home-stat-label">Active Users</div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="home-features">
        <div className="home-feature-card">
          <div className="home-feature-icon">
            <Target className="home-feature-icon-svg" />
          </div>
          <h3 className="home-feature-title">Poisson Distribution</h3>
          <p className="home-feature-description">
            Advanced mathematical modeling for accurate goal probability calculations
          </p>
        </div>
        <div className="home-feature-card">
          <div className="home-feature-icon">
            <TrendingUp className="home-feature-icon-svg" />
          </div>
          <h3 className="home-feature-title">Home Advantage</h3>
          <p className="home-feature-description">
            Statistical analysis of home/away performance and venue factors
          </p>
        </div>
        <div className="home-feature-card">
          <div className="home-feature-icon">
            <Zap className="home-feature-icon-svg" />
          </div>
          <h3 className="home-feature-title">Value Detection</h3>
          <p className="home-feature-description">
            Identify overvalued odds and find profitable betting opportunities
          </p>
        </div>
      </section>

      {/* Today's Predictions Section */}
      <section className="home-matches-section">
        <div className="home-matches-header">
          <h2 className="home-matches-title">Today's Predictions</h2>
          <Link to="/predictions?filter=today" className="home-view-all">
            View All →
          </Link>
        </div>

        {todaysMatches.length === 0 ? (
          <div className="home-empty-state">
            <div className="home-empty-icon">⚽</div>
            <h3 className="home-empty-title">No matches today</h3>
            <p className="home-empty-description">Check back tomorrow for today's predictions</p>
          </div>
        ) : (
          <div className="home-matches-grid">
            {todaysMatches.slice(0, 3).map((match, index) => (
              <div
                key={index}
                className={match.valueBet ? 'home-match-card home-match-value' : 'home-match-card'}
              >
                <div className="home-match-header">
                  <div className="home-match-meta">
                    <div className="home-match-meta-item">
                      <Clock className="home-match-icon" />
                      <span>{new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {match.valueBet && (
                    <div className="home-value-badge">
                      <Star className="home-value-icon" />
                      <span>VALUE BET</span>
                    </div>
                  )}
                </div>

                <div className="home-match-info">
                  <h3 className="home-match-teams">
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </h3>
                  <p className="home-match-league">{match.competition?.name || 'Premier League'}</p>
                </div>

                {match.myPrediction ? (
                  // Show prediction data for matches with predictions
                  <>
                    <div className="home-prediction-section">
                      <div className="home-prediction-display">
                        <div className="home-prediction-value">{match.myPrediction}</div>
                        <div className="home-prediction-confidence">{match.confidence}% Confidence</div>
                      </div>
                    </div>

                    {match.bookmakerOdds && (
                      <div className="home-odds-info">
                        <span className="home-odds-text">Odds:</span> {match.bookmakerOdds.home} - {match.bookmakerOdds.draw} - {match.bookmakerOdds.away}
                      </div>
                    )}
                  </>
                ) : (
                  // Show "Get Prediction" for real matches without predictions
                  <div className="home-prediction-section">
                    <div className="home-prediction-display">
                      <div className="home-prediction-label">Real League Match</div>
                      <div className="home-prediction-value">🔮</div>
                      <div className="home-prediction-confidence">Click to get AI prediction</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Outcomes Section */}
      <section className="home-matches-section">
        <div className="home-matches-header">
          <h2 className="home-matches-title">Recent Outcomes</h2>
          <Link to="/outcomes" className="home-view-all">
            View All →
          </Link>
        </div>

        {outcomes.length === 0 ? (
          <div className="home-empty-state">
            <div className="home-empty-icon">📊</div>
            <h3 className="home-empty-title">No recent outcomes</h3>
            <p className="home-empty-description">Outcomes will appear here after matches are completed</p>
          </div>
        ) : (
          <div className="home-matches-grid">
            {outcomes.slice(0, 3).map((outcome, index) => (
              <div key={index} className="home-match-card">
                <div className="home-match-header">
                  <div className="home-match-meta">
                    <div className="home-match-meta-item">
                      <Calendar className="home-match-icon" />
                      <span>{new Date(outcome.utcDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className={`home-outcome-badge ${outcome.actualResult === outcome.prediction ? 'correct' : 'incorrect'}`}>
                    {outcome.actualResult === outcome.prediction ? '✅ Correct' : '❌ Incorrect'}
                  </div>
                </div>

                <div className="home-match-info">
                  <h3 className="home-match-teams">
                    {outcome.homeTeam.name} vs {outcome.awayTeam.name}
                  </h3>
                  <p className="home-match-league">{outcome.competition?.name || 'Premier League'}</p>
                </div>

                <div className="home-prediction-section">
                  <div className="home-prediction-display">
                    <div className="home-prediction-label">Predicted: {outcome.prediction}</div>
                    <div className="home-prediction-label">Actual: {outcome.actualResult}</div>
                    <div className="home-prediction-confidence">{outcome.confidence}% Confidence</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Matches */}
      <section className="home-matches-section">
        <div className="home-matches-header">
          <h2 className="home-matches-title">Featured Predictions</h2>
          <Link to="/predictions" className="home-view-all">
            View All →
          </Link>
        </div>

        <div className="home-matches-grid">
          {featuredMatches.map((match, index) => (
            <div
              key={index}
              className={match.valueBet ? 'home-match-card home-match-value' : 'home-match-card'}
            >
              <div className="home-match-header">
                <div className="home-match-meta">
                  <div className="home-match-meta-item">
                    <Calendar className="home-match-icon" />
                    <span>{new Date(match.utcDate).toLocaleDateString()}</span>
                  </div>
                  <div className="home-match-meta-item">
                    <Clock className="home-match-icon" />
                    <span>{new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {match.valueBet && (
                  <div className="home-value-badge">
                    <Star className="home-value-icon" />
                    <span>VALUE BET</span>
                  </div>
                )}
              </div>

              <div className="home-match-info">
                <h3 className="home-match-teams">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </h3>
                <p className="home-match-league">{match.competition?.name || 'Premier League'}</p>
              </div>

              {/* Prediction Display */}
              <div className="home-prediction-section">
                <div className="home-prediction-display">
                  <div className="home-prediction-label">AI Prediction</div>
                  <div className="home-prediction-value">{match.myPrediction}</div>
                  <div className="home-prediction-confidence">{match.confidence}% Confidence</div>
                </div>

                <div className="home-prediction-grid">
                  <div className={match.myPrediction === '1' ? 'home-prediction-btn home-prediction-active' : 'home-prediction-btn'}>
                    <div className="home-prediction-label">HOME</div>
                    <div className="home-prediction-confidence">
                      {match.myPrediction === '1' ? `${match.confidence}%` : '-'}
                    </div>
                  </div>
                  <div className={match.myPrediction === 'X' ? 'home-prediction-btn home-prediction-active' : 'home-prediction-btn'}>
                    <div className="home-prediction-label">DRAW</div>
                    <div className="home-prediction-confidence">
                      {match.myPrediction === 'X' ? `${match.confidence}%` : '-'}
                    </div>
                  </div>
                  <div className={match.myPrediction === '2' ? 'home-prediction-btn home-prediction-active' : 'home-prediction-btn'}>
                    <div className="home-prediction-label">AWAY</div>
                    <div className="home-prediction-confidence">
                      {match.myPrediction === '2' ? `${match.confidence}%` : '-'}
                    </div>
                  </div>
                </div>
              </div>

              {match.bookmakerOdds && (
                <div className="home-odds-info">
                  <span className="home-odds-text">Odds:</span> {match.bookmakerOdds.home} - {match.bookmakerOdds.draw} - {match.bookmakerOdds.away}
                </div>
              )}


            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
