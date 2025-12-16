import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Users, DollarSign, TrendingUp, UserCheck, UserX, Shield, BarChart3, Settings, Plus, Calendar, Trophy, Target, Gamepad2, Star, LogOut, CheckCircle } from 'lucide-react';
import '../css/Admin.css';

const Admin = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [bets, setBets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [newTeam, setNewTeam] = useState({ name: '', league: '' });
  const [newLeague, setNewLeague] = useState({ name: '', code: '', country: '', teams: [] });
  const [newTeamToAdd, setNewTeamToAdd] = useState({ name: '', code: '', founded: '', stadium: '' });
  const [selectedLeagueForTeams, setSelectedLeagueForTeams] = useState('');
  const [newGame, setNewGame] = useState({
    homeTeam: '',
    awayTeam: '',
    league: '',
    date: '',
    time: '',
    predictions: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLeagues, setFilteredLeagues] = useState([]);
  const [filteredHomeTeams, setFilteredHomeTeams] = useState([]);
  const [filteredAwayTeams, setFilteredAwayTeams] = useState([]);

  // Teams organized by league - 2025/2026 season
  const leagueTeams = {
    // Top 5 European Leagues
    'Premier League': [
      'Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton & Hove Albion',
      'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Sunderland', 'Burnley',
      'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle United',
      'Nottingham Forest', 'Leeds', 'Tottenham Hotspur', 'West Ham United',
      'Wolverhampton Wanderers'
    ],
    'La Liga': [
      'Alavés', 'Almería', 'Athletic Club', 'Atlético Madrid', 'Barcelona',
      'Betis', 'Levante', 'Celta Vigo', 'Deportivo La Coruña', 'Espanyol', 'Getafe',
      'Girona', 'Granada', 'Elche', 'Leganés', 'Mallorca', 'Osasuna',
      'Rayo Vallecano', 'Real Madrid', 'Real Sociedad', 'Sevilla', 'Valencia',
      'Villarreal'
    ],
    'Serie A': [
      'Atalanta', 'Bologna', 'Cagliari', 'Como', 'Empoli', 'Fiorentina',
      'Genoa', 'Hellas Verona', 'Inter Milan', 'Juventus', 'Lazio', 'Lecce',
      'Milan', 'Monza', 'Napoli', 'Parma', 'Roma', 'Salernitana', 'Sassuolo',
      'Torino', 'Udinese', 'Venezia'
    ],
    'Bundesliga': [
      'Augsburg', 'Bayer Leverkusen', 'Bayern Munich', 'Bochum', 'Borussia Dortmund',
      'Borussia Mönchengladbach', 'Darmstadt', 'Eintracht Frankfurt', 'Freiburg',
      'Heidenheim', 'Hoffenheim', 'Holstein Kiel', 'Köln', 'Mainz', 'RB Leipzig',
      'St. Pauli', 'Union Berlin', 'VfB Stuttgart', 'VfL Bochum', 'VfL Wolfsburg'
    ],
    'Ligue 1': [
      'Angers', 'AS Monaco', 'Auxerre', 'Brest', 'Clermont Foot', 'Le Havre',
      'Lens', 'Lille', 'Lorient', 'Lyon', 'Marseille', 'Metz', 'Montpellier',
      'Nantes', 'Nice', 'Olympique Lyonnais', 'Paris Saint-Germain', 'Reims',
      'Rennes', 'Saint-Étienne', 'Strasbourg', 'Toulouse'
    ],

    // Major League Soccer (MLS)
    'MLS': [
      'Atlanta United', 'Austin FC', 'CF Montréal', 'Charlotte FC', 'Chicago Fire',
      'Colorado Rapids', 'Columbus Crew', 'D.C. United', 'FC Cincinnati', 'FC Dallas',
      'Houston Dynamo', 'Inter Miami', 'LA Galaxy', 'Los Angeles FC', 'Minnesota United',
      'Nashville SC', 'New England Revolution', 'New York City FC', 'New York Red Bulls',
      'Orlando City', 'Philadelphia Union', 'Portland Timbers', 'Real Salt Lake',
      'San Jose Earthquakes', 'Seattle Sounders', 'Sporting Kansas City', 'St. Louis City',
      'Toronto FC', 'Vancouver Whitecaps'
    ],

    // Other Top European Leagues
    'Eredivisie': [
      'Ajax', 'Almere City', 'AZ Alkmaar', 'Excelsior', 'Feyenoord', 'Fortuna Sittard',
      'Go Ahead Eagles', 'Groningen', 'Heerenveen', 'Heracles Almelo', 'NAC Breda',
      'NEC Nijmegen', 'PSV Eindhoven', 'RKC Waalwijk', 'Sparta Rotterdam',
      'Twente', 'Utrecht', 'Vitesse', 'Waalwijk', 'Willem II'
    ],
    'Primeira Liga': [
      'Arouca', 'Benfica', 'Boavista', 'Braga', 'Casa Pia', 'Chaves', 'Estoril',
      'Estrela Amadora', 'Famalicão', 'Farense', 'Gil Vicente', 'Marítimo',
      'Moreirense', 'Nacional', 'Porto', 'Portimonense', 'Rio Ave', 'Santa Clara',
      'Sporting CP', 'Vitória Guimarães'
    ],
    'Scottish Premiership': [
      'Aberdeen', 'Celtic', 'Dundee', 'Dundee United', 'Hearts', 'Hibernian',
      'Kilmarnock', 'Livingston', 'Motherwell', 'Rangers', 'Ross County',
      'St Johnstone', 'St Mirren'
    ],
    'Turkish Süper Lig': [
      'Adana Demirspor', 'Alanyaspor', 'Antalyaspor', 'Başakşehir', 'Beşiktaş',
      'Bodrum', 'Eyüpspor', 'Fenerbahçe', 'Galatasaray', 'Gaziantep', 'Hatayspor',
      'Kayserispor', 'Konyaspor', 'Rizespor', 'Samsunspor', 'Sivasspor',
      'Trabzonspor', 'İstanbulspor'
    ],

    // European Competitions (representative teams)
    'Champions League': [
      'Arsenal', 'Atlético Madrid', 'Barcelona', 'Bayern Munich', 'Borussia Dortmund',
      'Inter Milan', 'Juventus', 'Lens', 'Liverpool', 'Manchester City',
      'Manchester United', 'Napoli', 'Paris Saint-Germain', 'PSV Eindhoven',
      'Real Madrid', 'Roma', 'Sevilla', 'Sporting CP'
    ],
    'Europa League': [
      'Ajax', 'Aston Villa', 'Atalanta', 'AZ Alkmaar', 'Benfica', 'Brighton & Hove Albion',
      'Club Brugge', 'Dinamo Zagreb', 'Eintracht Frankfurt', 'FC Copenhagen', 'Fenerbahçe',
      'Fiorentina', 'Galatasaray', 'Hellas Verona', 'Lazio', 'Liverpool', 'Lyon',
      'Manchester United', 'Marseille', 'Midtjylland', 'Monaco', 'Napoli', 'Olympiacos',
      'Olympique Lyonnais', 'PAOK', 'Panathinaikos', 'Rangers', 'Real Sociedad', 'Roma',
      'SC Freiburg', 'Sevilla', 'Slavia Prague', 'Sporting CP', 'Tottenham Hotspur', 'Villarreal'
    ],

    // Other International Leagues
    'Brasileirão': [
      'Athletico Paranaense', 'Atlético Mineiro', 'Bahia', 'Botafogo', 'Corinthians',
      'Criciúma', 'Cruzeiro', 'Cuiabá', 'Flamengo', 'Fluminense', 'Fortaleza',
      'Grêmio', 'Internacional', 'Juventude', 'Palmeiras', 'Red Bull Bragantino',
      'Santos', 'São Paulo', 'Vasco da Gama', 'Vitória'
    ],
    'Argentine Primera División': [
      'Argentinos Juniors', 'Atlético Tucumán', 'Banfield', 'Barracas Central',
      'Belgrano', 'Boca Juniors', 'Central Córdoba', 'Defensa y Justicia',
      'Estudiantes', 'Gimnasia La Plata', 'Godoy Cruz', 'Huracán', 'Independiente',
      'Instituto', 'Lanús', 'Newell\'s Old Boys', 'Platense', 'Racing Club',
      'River Plate', 'Rosario Central', 'San Lorenzo', 'Sarmiento', 'Talleres',
      'Tigre', 'Unión', 'Vélez Sarsfield'
    ]
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'dashboard') {
        const statsRes = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(statsRes.data);
      } else if (activeTab === 'leagues') {
        const token = localStorage.getItem('token');
        const leaguesRes = await axios.get('http://localhost:5000/api/leagues', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setLeagues(leaguesRes.data);
      } else if (activeTab === 'games') {
        const token = localStorage.getItem('token');
        const gamesRes = await axios.get('http://localhost:5000/api/matches/admin', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setGames(gamesRes.data);
      } else if (activeTab === 'users') {
        const usersRes = await axios.get('http://localhost:5000/api/admin/users');
        setUsers(usersRes.data);
      } else if (activeTab === 'bets') {
        const betsRes = await axios.get('http://localhost:5000/api/admin/bets');
        setBets(betsRes.data);
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}`, { role });
      toast.success('User role updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}`, { isActive });
      toast.success('User status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
      toast.success('User deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const updateBetResult = async (userId, betId, result) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/bets/${userId}/${betId}`, { result });
      toast.success('Bet result updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update bet');
    }
  };

  const handleMarkOutcome = async (matchId, predictionType, prediction, actualResult) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/outcomes/${matchId}/outcome`, {
        predictionType,
        prediction,
        actualResult
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success(`Prediction marked as ${actualResult === 'win' ? 'correct' : 'incorrect'}`);
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error marking outcome:', error);
      toast.error('Failed to mark outcome');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <div className="admin-access-denied-content">
          <Shield className="admin-access-denied-icon" />
          <h2 className="admin-access-denied-title">Access Denied</h2>
          <p className="admin-access-denied-message">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'leagues', label: 'Leagues & Teams', icon: Trophy },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'outcomes', label: 'Manage Outcomes', icon: CheckCircle },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'bets', label: 'All Bets', icon: DollarSign },
    { id: 'vip', label: 'VIP Management', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1 className="admin-title">
              Admin Panel
            </h1>
            <p className="admin-subtitle">
              Manage users, bets, and system statistics
            </p>
          </div>
          <button onClick={logout} className="admin-logout-btn">
            <LogOut className="admin-logout-icon" />
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <div className="admin-tabs-container">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`admin-tab-btn ${activeTab === id ? 'active' : ''}`}
            >
              <Icon className="admin-tab-icon" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="admin-dashboard">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-loading-spinner"></div>
              <div className="admin-loading-text">Loading dashboard...</div>
            </div>
          ) : stats ? (
            <>
              {/* Stats Cards */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <Users className="admin-stat-icon users" />
                  <div className="admin-stat-value">{stats.totalUsers}</div>
                  <div className="admin-stat-label">Total Users</div>
                </div>

                <div className="admin-stat-card">
                  <UserCheck className="admin-stat-icon active" />
                  <div className="admin-stat-value">{stats.activeUsers}</div>
                  <div className="admin-stat-label">Active Users</div>
                </div>

                <div className="admin-stat-card">
                  <DollarSign className="admin-stat-icon bets" />
                  <div className="admin-stat-value">{stats.totalBets}</div>
                  <div className="admin-stat-label">Total Bets</div>
                </div>

                <div className="admin-stat-card">
                  <TrendingUp className="admin-stat-icon profit" />
                  <div className="admin-stat-value">€{stats.totalProfit ? stats.totalProfit.toFixed(0) : '0'}</div>
                  <div className="admin-stat-label">Total Profit</div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="admin-overview-grid">
                <div className="admin-overview-card">
                  <h3 className="admin-overview-title">Platform Overview</h3>
                  <div className="admin-overview-stats">
                    <div className="admin-overview-stat">
                      <span className="admin-overview-label">Active Admins</span>
                      <span className="admin-overview-value">{stats.adminUsers}</span>
                    </div>
                    <div className="admin-overview-stat">
                      <span className="admin-overview-label">Total Staked</span>
                      <span className="admin-overview-value">€{stats.totalStaked ? stats.totalStaked.toFixed(0) : '0'}</span>
                    </div>
                    <div className={`admin-overview-stat ${stats.averageROI >= 0 ? 'roi-positive' : 'roi-negative'}`}>
                      <span className="admin-overview-label">Average ROI</span>
                      <span className="admin-overview-value">
                        {stats.averageROI ? stats.averageROI.toFixed(1) : '0.0'}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="admin-overview-card">
                  <h3 className="admin-overview-title">Quick Actions</h3>
                  <div className="admin-quick-actions">
                    <button
                      onClick={() => setActiveTab('users')}
                      className="admin-action-btn primary"
                    >
                      Manage Users
                    </button>
                    <button
                      onClick={() => setActiveTab('bets')}
                      className="admin-action-btn success"
                    >
                      Review Bets
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Leagues & Teams Management */}
      {activeTab === 'leagues' && (
        <div className="admin-leagues-section">
          {/* Create New League */}
          <div className="admin-data-card">
            <h3 className="admin-data-title">
              <Trophy className="admin-icon-inline" />
              Create New League
            </h3>
            <form className="admin-form">
              <div className="admin-form-grid-3">
                <div className="admin-form-group">
                  <label className="admin-form-label">League Name</label>
                  <input
                    type="text"
                    value={newLeague.name}
                    onChange={(e) => setNewLeague({ ...newLeague, name: e.target.value })}
                    className="admin-form-input"
                    placeholder="e.g., Premier League"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Code</label>
                  <input
                    type="text"
                    value={newLeague.code}
                    onChange={(e) => setNewLeague({ ...newLeague, code: e.target.value.toUpperCase() })}
                    className="admin-form-input"
                    placeholder="e.g., PL"
                    maxLength="3"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Country</label>
                  <input
                    type="text"
                    value={newLeague.country}
                    onChange={(e) => setNewLeague({ ...newLeague, country: e.target.value })}
                    className="admin-form-input"
                    placeholder="e.g., England"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (!newLeague.name || !newLeague.code || !newLeague.country) {
                    toast.error('Please fill in all fields');
                    return;
                  }

                  try {
                    const token = localStorage.getItem('token');
                    await axios.post('http://localhost:5000/api/leagues', {
                      name: newLeague.name,
                      code: newLeague.code,
                      country: newLeague.country
                    }, {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });

                    toast.success(`League "${newLeague.name}" created successfully!`);
                    setNewLeague({ name: '', code: '', country: '', teams: [] });
                    fetchData(); // Refresh leagues list
                  } catch (err) {
                    toast.error(err.response?.data?.error || 'Failed to create league');
                  }
                }}
                className="admin-btn-success"
              >
                Create League
              </button>
            </form>
          </div>

          {/* Add Team to League */}
          <div className="admin-data-card">
            <h3 className="admin-data-title">
              <Plus className="admin-icon-inline" />
              Add Team to League
            </h3>
            <form className="admin-form">
              <div className="admin-form-grid-4">
                <div className="admin-form-group">
                  <label className="admin-form-label">Select League</label>
                  <select
                    value={selectedLeagueForTeams}
                    onChange={(e) => setSelectedLeagueForTeams(e.target.value)}
                    className="admin-form-select"
                  >
                    <option value="">Select League</option>
                    {leagues && leagues.length > 0 ? leagues.map(league => (
                      <option key={league._id} value={league._id}>
                        {league.name} ({league.teams?.length || 0} teams)
                      </option>
                    )) : (
                      <option value="" disabled>No leagues available</option>
                    )}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Team Name</label>
                  <input
                    type="text"
                    value={newTeamToAdd.name}
                    onChange={(e) => setNewTeamToAdd({ ...newTeamToAdd, name: e.target.value })}
                    className="admin-form-input"
                    placeholder="e.g., Manchester United"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Team Code</label>
                  <input
                    type="text"
                    value={newTeamToAdd.code}
                    onChange={(e) => setNewTeamToAdd({ ...newTeamToAdd, code: e.target.value.toUpperCase() })}
                    className="admin-form-input"
                    placeholder="e.g., MUN"
                    maxLength="3"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Founded Year</label>
                  <input
                    type="number"
                    value={newTeamToAdd.founded}
                    onChange={(e) => setNewTeamToAdd({ ...newTeamToAdd, founded: e.target.value })}
                    className="admin-form-input"
                    placeholder="e.g., 1878"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Stadium (Optional)</label>
                <input
                  type="text"
                  value={newTeamToAdd.stadium}
                  onChange={(e) => setNewTeamToAdd({ ...newTeamToAdd, stadium: e.target.value })}
                  className="admin-form-input"
                  placeholder="e.g., Old Trafford"
                />
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (!selectedLeagueForTeams || !newTeamToAdd.name) {
                    toast.error('Please select a league and enter team name');
                    return;
                  }

                  try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`http://localhost:5000/api/leagues/${selectedLeagueForTeams}/teams`, {
                      name: newTeamToAdd.name,
                      code: newTeamToAdd.code,
                      founded: newTeamToAdd.founded,
                      stadium: newTeamToAdd.stadium
                    }, {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });

                    const addedTeam = response.data;

                    toast.success(`Team "${newTeamToAdd.name}" added to league successfully!`);
                    setNewTeamToAdd({ name: '', code: '', founded: '', stadium: '' });

                    // Update leagues state directly to show the new team immediately
                    const updatedLeagues = leagues.map(league =>
                      league._id === selectedLeagueForTeams
                        ? { ...league, teams: [...(league.teams || []), addedTeam] }
                        : league
                    );
                    setLeagues(updatedLeagues);
                    setSelectedLeagueForTeams(''); // Clear selection
                  } catch (err) {
                    toast.error(err.response?.data?.error || 'Failed to add team');
                  }
                }}
                className="admin-btn-warning"
              >
                Add Team
              </button>
            </form>
          </div>

          {/* Existing Leagues */}
          <div className="admin-data-card">
            <h3 className="admin-data-title">
              <Trophy className="admin-icon-inline" />
              Existing Leagues & Teams
            </h3>

            {leagues.length === 0 ? (
              <div className="admin-empty-state">
                <div className="admin-empty-text">No leagues created yet</div>
                <div className="admin-empty-subtitle">Use the form above to create your first league</div>
              </div>
            ) : (
              <div className="admin-leagues-list">
                {leagues.map((league, index) => (
                  <div key={league._id || index} className="admin-league-card">
                    <div className="admin-league-header">
                      <div className="admin-league-info">
                        <h4 className="admin-league-name">
                          {league.name} ({league.code})
                        </h4>
                        <p className="admin-league-country">{league.country}</p>
                      </div>
                      <div className="admin-league-stats">
                        <span className="admin-league-team-count">
                          {league.teams?.length || 0} teams
                        </span>
                      </div>
                    </div>

                    <div className="admin-league-teams">
                      {league.teams && league.teams.length > 0 ? (
                        <div className="admin-teams-grid">
                          {league.teams.map((team, teamIndex) => (
                            <div key={teamIndex} className="admin-team-item">
                              <div className="admin-team-info">
                                <span className="admin-team-name">{team.name}</span>
                                {team.code && (
                                  <span className="admin-team-code">({team.code})</span>
                                )}
                              </div>
                              <button
                                onClick={async () => {
                                  if (window.confirm(`Remove ${team.name} from ${league.name}?`)) {
                                    try {
                                      const token = localStorage.getItem('token');
                                      await axios.delete(`http://localhost:5000/api/leagues/${league._id}/teams/${teamIndex}`, {
                                        headers: {
                                          'Authorization': `Bearer ${token}`
                                        }
                                      });
                                      toast.success('Team removed successfully');
                                      fetchData();
                                    } catch (err) {
                                      toast.error('Failed to remove team');
                                    }
                                  }
                                }}
                                className="admin-team-remove-btn"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="admin-no-teams">
                          <span>No teams added yet</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Games Management */}
      {activeTab === 'games' && (
        <div className="admin-games-section">
          {/* Add Game Form */}
          <div className="admin-data-card">
            <h3 className="admin-data-title">
              <Calendar className="admin-icon-inline" />
              Add New Game
            </h3>
            <form className="admin-form">
              {/* Match Details */}
              <div className="admin-form-grid-3">
                <div className="admin-form-group">
                  <label className="admin-form-label">Home Team</label>
                  <select
                    value={newGame.homeTeam}
                    onChange={(e) => setNewGame({ ...newGame, homeTeam: e.target.value })}
                    className="admin-form-select"
                  >
                    <option value="">Select Home Team</option>
                    {newGame.league && leagueTeams[newGame.league] ? (
                      leagueTeams[newGame.league].map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))
                    ) : (
                      <option value="" disabled>Please select a league first</option>
                    )}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Away Team</label>
                  <select
                    value={newGame.awayTeam}
                    onChange={(e) => setNewGame({ ...newGame, awayTeam: e.target.value })}
                    className="admin-form-select"
                  >
                    <option value="">Select Away Team</option>
                    {newGame.league && leagueTeams[newGame.league] ? (
                      leagueTeams[newGame.league].map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))
                    ) : (
                      <option value="" disabled>Please select a league first</option>
                    )}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">League</label>
                  <select
                    value={newGame.league}
                    onChange={(e) => {
                      // Clear selected teams when league changes
                      setNewGame({
                        ...newGame,
                        league: e.target.value,
                        homeTeam: '',
                        awayTeam: ''
                      });
                    }}
                    className="admin-form-select"
                  >
                    <option value="">Select League</option>
                    {/* Top 5 European Leagues */}
                    <option value="Premier League">🇬🇧 Premier League</option>
                    <option value="La Liga">🇪🇸 La Liga</option>
                    <option value="Serie A">🇮🇹 Serie A</option>
                    <option value="Bundesliga">🇩🇪 Bundesliga</option>
                    <option value="Ligue 1">🇫🇷 Ligue 1</option>

                    {/* MLS */}
                    <option value="MLS">🇺🇸 MLS</option>

                    {/* Other European Leagues */}
                    <option value="Eredivisie">🇳🇱 Eredivisie</option>
                    <option value="Primeira Liga">🇵🇹 Primeira Liga</option>
                    <option value="Scottish Premiership">🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish Premiership</option>
                    <option value="Turkish Süper Lig">🇹🇷 Turkish Süper Lig</option>

                    {/* European Competitions */}
                    <option value="Champions League">🏆 Champions League</option>
                    <option value="Europa League">🥈 Europa League</option>

                    {/* International Leagues */}
                    <option value="Brasileirão">🇧🇷 Brasileirão</option>
                    <option value="Argentine Primera División">🇦🇷 Argentine Primera División</option>
                  </select>
                </div>
              </div>

              {/* Date and Time */}
              <div className="admin-form-grid-3">
                <div className="admin-form-group">
                  <label className="admin-form-label">Match Date</label>
                  <input
                    type="date"
                    value={newGame.date}
                    onChange={(e) => setNewGame({ ...newGame, date: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Match Time</label>
                  <input
                    type="time"
                    value={newGame.time}
                    onChange={(e) => setNewGame({ ...newGame, time: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">VIP Only</label>
                  <div className="admin-checkbox-group">
                    <input
                      type="checkbox"
                      id="vip-only"
                      checked={newGame.isVIP || false}
                      onChange={(e) => setNewGame({ ...newGame, isVIP: e.target.checked })}
                      className="admin-checkbox"
                    />
                    <label htmlFor="vip-only" className="admin-checkbox-label">
                      Make this game VIP-only
                    </label>
                  </div>
                </div>
              </div>

              {/* Predictions */}
              <div className="admin-form-section">
                <div className="admin-predictions-header">
                  <h4 className="admin-form-section-title">
                    <Trophy className="admin-icon-inline" />
                    Predictions
                  </h4>
                  <button
                    type="button"
                    onClick={() => setNewGame({
                      ...newGame,
                      predictions: [...newGame.predictions, {
                        type: 'win',
                        prediction: '1',
                        confidence: 50,
                        valueBet: false,
                        odds: { home: 2.0, draw: 3.0, away: 2.0 }
                      }]
                    })}
                    className="admin-btn-add-prediction"
                  >
                    <Plus className="admin-btn-icon" />
                    Add Prediction
                  </button>
                </div>

                {newGame.predictions.map((pred, index) => (
                  <div key={index} className="admin-prediction-item">
                    <div className="admin-prediction-item-header">
                      <h5 className="admin-prediction-item-title">Prediction #{index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedPredictions = newGame.predictions.filter((_, i) => i !== index);
                          setNewGame({ ...newGame, predictions: updatedPredictions });
                        }}
                        className="admin-btn-remove"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="admin-form-grid-4">
                      <div className="admin-form-group">
                        <label className="admin-form-label">Type</label>
                        <select
                          value={pred.type}
                          onChange={(e) => {
                            const updatedPredictions = [...newGame.predictions];
                            updatedPredictions[index] = { ...pred, type: e.target.value };
                            setNewGame({ ...newGame, predictions: updatedPredictions });
                          }}
                          className="admin-form-select"
                        >
                          <option value="win">Win</option>
                          <option value="over15">Over 1.5</option>
                          <option value="over25">Over 2.5</option>
                          <option value="player">Player</option>
                        </select>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Prediction</label>
                        {pred.type === 'win' ? (
                          <select
                            value={pred.prediction}
                            onChange={(e) => {
                              const updatedPredictions = [...newGame.predictions];
                              updatedPredictions[index] = { ...pred, prediction: e.target.value };
                              setNewGame({ ...newGame, predictions: updatedPredictions });
                            }}
                            className="admin-form-select"
                          >
                            <option value="1">Home Win (1)</option>
                            <option value="X">Draw (X)</option>
                            <option value="2">Away Win (2)</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={pred.prediction}
                            onChange={(e) => {
                              const updatedPredictions = [...newGame.predictions];
                              updatedPredictions[index] = { ...pred, prediction: e.target.value };
                              setNewGame({ ...newGame, predictions: updatedPredictions });
                            }}
                            className="admin-form-input"
                            placeholder="Enter prediction"
                          />
                        )}
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Confidence (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={pred.confidence}
                          onChange={(e) => {
                            const updatedPredictions = [...newGame.predictions];
                            updatedPredictions[index] = { ...pred, confidence: parseInt(e.target.value) || 0 };
                            setNewGame({ ...newGame, predictions: updatedPredictions });
                          }}
                          className="admin-form-input"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Value Bet</label>
                        <select
                          value={pred.valueBet ? 'yes' : 'no'}
                          onChange={(e) => {
                            const updatedPredictions = [...newGame.predictions];
                            updatedPredictions[index] = { ...pred, valueBet: e.target.value === 'yes' };
                            setNewGame({ ...newGame, predictions: updatedPredictions });
                          }}
                          className="admin-form-select"
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                    </div>

                    {/* Odds for this prediction */}
                    <div className="admin-prediction-odds">
                      <h6 className="admin-prediction-odds-title">Odds for this prediction</h6>
                      <div className="admin-form-grid-3">
                        {pred.type === 'win' ? (
                          <>
                            <div className="admin-form-group">
                              <label className="admin-form-label">Home Win</label>
                              <input
                                type="number"
                                step="0.01"
                                value={pred.odds?.home || ''}
                                onChange={(e) => {
                                  const updatedPredictions = [...newGame.predictions];
                                  updatedPredictions[index] = {
                                    ...pred,
                                    odds: { ...pred.odds, home: parseFloat(e.target.value) || 0 }
                                  };
                                  setNewGame({ ...newGame, predictions: updatedPredictions });
                                }}
                                className="admin-form-input"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label className="admin-form-label">Draw</label>
                              <input
                                type="number"
                                step="0.01"
                                value={pred.odds?.draw || ''}
                                onChange={(e) => {
                                  const updatedPredictions = [...newGame.predictions];
                                  updatedPredictions[index] = {
                                    ...pred,
                                    odds: { ...pred.odds, draw: parseFloat(e.target.value) || 0 }
                                  };
                                  setNewGame({ ...newGame, predictions: updatedPredictions });
                                }}
                                className="admin-form-input"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label className="admin-form-label">Away Win</label>
                              <input
                                type="number"
                                step="0.01"
                                value={pred.odds?.away || ''}
                                onChange={(e) => {
                                  const updatedPredictions = [...newGame.predictions];
                                  updatedPredictions[index] = {
                                    ...pred,
                                    odds: { ...pred.odds, away: parseFloat(e.target.value) || 0 }
                                  };
                                  setNewGame({ ...newGame, predictions: updatedPredictions });
                                }}
                                className="admin-form-input"
                              />
                            </div>
                          </>
                        ) : pred.type === 'over15' || pred.type === 'over25' ? (
                          <>
                            <div className="admin-form-group">
                              <label className="admin-form-label">Over</label>
                              <input
                                type="number"
                                step="0.01"
                                value={pred.odds?.over || ''}
                                onChange={(e) => {
                                  const updatedPredictions = [...newGame.predictions];
                                  updatedPredictions[index] = {
                                    ...pred,
                                    odds: { ...pred.odds, over: parseFloat(e.target.value) || 0 }
                                  };
                                  setNewGame({ ...newGame, predictions: updatedPredictions });
                                }}
                                className="admin-form-input"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label className="admin-form-label">Under</label>
                              <input
                                type="number"
                                step="0.01"
                                value={pred.odds?.under || ''}
                                onChange={(e) => {
                                  const updatedPredictions = [...newGame.predictions];
                                  updatedPredictions[index] = {
                                    ...pred,
                                    odds: { ...pred.odds, under: parseFloat(e.target.value) || 0 }
                                  };
                                  setNewGame({ ...newGame, predictions: updatedPredictions });
                                }}
                                className="admin-form-input"
                              />
                            </div>
                          </>
                        ) : (
                          <div className="admin-form-group">
                            <label className="admin-form-label">Odds</label>
                            <input
                              type="number"
                              step="0.01"
                              value={pred.odds?.home || ''}
                              onChange={(e) => {
                                const updatedPredictions = [...newGame.predictions];
                                updatedPredictions[index] = {
                                  ...pred,
                                  odds: { ...pred.odds, home: parseFloat(e.target.value) || 0 }
                                };
                                setNewGame({ ...newGame, predictions: updatedPredictions });
                              }}
                              className="admin-form-input"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {newGame.predictions.length === 0 && (
                  <div className="admin-empty-predictions">
                    <p className="admin-empty-text">No predictions added yet</p>
                    <p className="admin-empty-subtitle">Click "Add Prediction" to add your first prediction</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (!newGame.homeTeam || !newGame.awayTeam || !newGame.league || !newGame.date || !newGame.time) {
                    toast.error('Please fill in all required fields');
                    return;
                  }

                  if (newGame.predictions.length === 0) {
                    toast.error('Please add at least one prediction');
                    return;
                  }

                  try {
                    const token = localStorage.getItem('token');
                    await axios.post('http://localhost:5000/api/matches', {
                      homeTeam: newGame.homeTeam,
                      awayTeam: newGame.awayTeam,
                      league: newGame.league,
                      date: newGame.date,
                      time: newGame.time,
                      predictions: newGame.predictions,
                      isVIP: newGame.isVIP || false
                    }, {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });

                    toast.success(`Game "${newGame.homeTeam} vs ${newGame.awayTeam}" added successfully!`);
                    setNewGame({
                      homeTeam: '',
                      awayTeam: '',
                      league: '',
                      date: '',
                      time: '',
                      predictions: []
                    });
                  } catch (err) {
                    toast.error(err.response?.data?.error || 'Failed to add game');
                  }
                }}
                className="admin-btn-warning"
              >
                Add Game
              </button>
            </form>
          </div>

          {/* Recent Games */}
          <div className="admin-data-card">
            <h3 className="admin-data-title">
              <Target className="admin-icon-inline" />
              Recent Games
            </h3>

            {games.length === 0 ? (
              <div className="admin-empty-state">
                <div className="admin-empty-text">No games added yet</div>
                <div className="admin-empty-subtitle">Use the form above to add your first game</div>
              </div>
            ) : (
              <div className="admin-games-list">
                {games.map((game, index) => (
                  <div key={game.id || index} className="admin-match-card">
                    <div className="admin-match-header">
                      <div className="admin-match-meta">
                        <div className="admin-match-meta-item">
                          <Calendar className="admin-match-icon" />
                          <span>{new Date(game.utcDate).toLocaleDateString()}</span>
                        </div>
                        <div className="admin-match-meta-item">
                          <span>{game.predictions?.length || 0} prediction{game.predictions?.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    <div className="admin-match-info">
                      <h3 className="admin-match-teams">
                        {game.homeTeam.name} vs {game.awayTeam.name}
                      </h3>
                      <p className="admin-match-league">{game.competition?.name || game.league}</p>
                    </div>

                    <div className="admin-predictions-list">
                      {game.predictions && game.predictions.length > 0 ? (
                        game.predictions.map((pred, predIndex) => (
                          <div key={predIndex} className={`admin-prediction-item-display ${pred.valueBet ? 'admin-match-value' : ''}`}>
                            <div className="admin-prediction-type">
                              <span className="admin-prediction-type-label">
                                {pred.type === 'win' ? 'WIN' :
                                 pred.type === 'over15' ? 'OVER 1.5' :
                                 pred.type === 'over25' ? 'OVER 2.5' :
                                 'PLAYER'}
                              </span>
                              {pred.valueBet && (
                                <div className="admin-value-badge-small">
                                  <Star className="admin-value-icon-small" />
                                  <span>VALUE</span>
                                </div>
                              )}
                            </div>

                            <div className="admin-prediction-details">
                              <div className="admin-prediction-value">{pred.prediction}</div>
                              <div className="admin-prediction-confidence">{pred.confidence}% confidence</div>
                            </div>

                            {pred.odds && (
                              <div className="admin-prediction-odds-display">
                                {pred.type === 'win' && (
                                  <span>{pred.odds.home || '-'} | {pred.odds.draw || '-'} | {pred.odds.away || '-'}</span>
                                )}
                                {(pred.type === 'over15' || pred.type === 'over25') && (
                                  <span>O: {pred.odds.over || '-'} | U: {pred.odds.under || '-'}</span>
                                )}
                                {pred.type === 'player' && (
                                  <span>{pred.odds.home || '-'}</span>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="admin-no-predictions">
                          <span>No predictions added</span>
                        </div>
                      )}
                    </div>

                    {game.bookmakerOdds && (
                      <div className="admin-odds-info">
                        <span className="admin-odds-text">Bookmaker Odds:</span> {game.bookmakerOdds.home} - {game.bookmakerOdds.draw} - {game.bookmakerOdds.away}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="admin-data-card">
          <h3 className="admin-data-title">User Management</h3>

          {loading ? (
            <div className="admin-loading">
              <div className="admin-loading-spinner"></div>
              <div className="admin-loading-text">Loading users...</div>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="admin-user-name">{user.username}</td>
                      <td className="admin-user-email">{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                          className={`admin-role-select ${user.role === 'admin' ? 'admin' : ''}`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <span className={`admin-status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="admin-user-joined">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="admin-user-actions">
                          <button
                            onClick={() => toggleUserStatus(user._id, !user.isActive)}
                            className={`admin-user-action-btn ${user.isActive ? 'deactivate' : 'activate'}`}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="admin-user-action-btn delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Bets Management */}
      {activeTab === 'bets' && (
        <div className="admin-data-card">
          <h3 className="admin-data-title">All Bets Management</h3>

          {loading ? (
            <div className="admin-loading">
              <div className="admin-loading-spinner"></div>
              <div className="admin-loading-text">Loading bets...</div>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Match</th>
                    <th>Prediction</th>
                    <th>Stake</th>
                    <th>Odds</th>
                    <th>Result</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bets.map((bet, index) => (
                    <tr key={index}>
                      <td className="admin-user-name">{bet.username}</td>
                      <td>Match {bet.matchId}</td>
                      <td>
                        <span className="admin-bet-result win">{bet.prediction}</span>
                      </td>
                      <td>€{bet.stake}</td>
                      <td>{bet.odds}</td>
                      <td>
                        <span className={`admin-bet-result ${bet.result === 'win' ? 'win' : bet.result === 'loss' ? 'loss' : 'pending'}`}>
                          {bet.result === 'win' ? 'Won' : bet.result === 'loss' ? 'Lost' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        {bet.result === 'pending' && (
                          <div className="admin-bet-actions">
                            <button
                              onClick={() => updateBetResult(bet.userId, bet._id, 'win')}
                              className="admin-bet-action-btn win"
                            >
                              Win
                            </button>
                            <button
                              onClick={() => updateBetResult(bet.userId, bet._id, 'loss')}
                              className="admin-bet-action-btn loss"
                            >
                              Loss
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Manage Outcomes */}
      {activeTab === 'outcomes' && (
        <div className="admin-outcomes-section">
          {/* Recent Matches with Pending Outcomes */}
          <div className="admin-data-card">
            <h3 className="admin-data-title">
              <CheckCircle className="admin-icon-inline" />
              Manage Prediction Outcomes
            </h3>
            <p className="admin-section-description">
              Mark predictions as win or loss to update user outcomes and statistics
            </p>

            {loading ? (
              <div className="admin-loading">
                <div className="admin-loading-spinner"></div>
                <div className="admin-loading-text">Loading matches...</div>
              </div>
            ) : (
              <div className="admin-matches-outcomes">
                {games.slice(0, 10).map((game, index) => (
                  <div key={game.id || index} className="admin-match-outcome-card">
                    <div className="admin-match-outcome-header">
                      <div className="admin-match-outcome-teams">
                        <h4>{game.homeTeam.name} vs {game.awayTeam.name}</h4>
                        <p className="admin-match-outcome-league">{game.competition?.name || game.league}</p>
                        <p className="admin-match-outcome-date">{new Date(game.utcDate).toLocaleDateString()}</p>
                      </div>
                      {game.homeGoals !== null && game.awayGoals !== null && (
                        <div className="admin-match-outcome-score">
                          {game.homeGoals} - {game.awayGoals}
                        </div>
                      )}
                    </div>

                    <div className="admin-match-outcome-predictions">
                      {game.predictions && game.predictions.map((pred, predIndex) => (
                        <div key={predIndex} className="admin-prediction-outcome">
                          <div className="admin-prediction-outcome-info">
                            <span className="admin-prediction-outcome-type">
                              {pred.type === 'win' ? 'Match Winner' :
                               pred.type === 'over15' ? 'Over/Under 1.5' :
                               pred.type === 'over25' ? 'Over/Under 2.5' :
                               'Player Prediction'}
                            </span>
                            <span className="admin-prediction-outcome-value">{pred.prediction}</span>
                            <span className="admin-prediction-outcome-confidence">{pred.confidence}%</span>
                          </div>

                          <div className="admin-prediction-outcome-actions">
                            <button
                              onClick={() => handleMarkOutcome(game.id, pred.type, pred.prediction, 'win')}
                              className="admin-outcome-btn win"
                            >
                              ✓ Win
                            </button>
                            <button
                              onClick={() => handleMarkOutcome(game.id, pred.type, pred.prediction, 'loss')}
                              className="admin-outcome-btn loss"
                            >
                              ✗ Loss
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {games.length === 0 && (
                  <div className="admin-empty-state">
                    <div className="admin-empty-text">No recent matches found</div>
                    <div className="admin-empty-subtitle">Add some matches first to manage their outcomes</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIP Management */}
      {activeTab === 'vip' && (
        <div className="admin-vip-section">
          {/* Pending VIP Payments */}
          <div className="admin-data-card">
            <h3 className="admin-data-title">
              <Star className="admin-icon-inline" />
              Pending VIP Payments
            </h3>

            {loading ? (
              <div className="admin-loading">
                <div className="admin-loading-spinner"></div>
                <div className="admin-loading-text">Loading VIP payments...</div>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Payment Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock data for now - replace with actual API call */}
                    <tr>
                      <td className="admin-user-name">johndoe</td>
                      <td className="admin-user-email">john@example.com</td>
                      <td>₦20,000</td>
                      <td>2025-12-16</td>
                      <td>
                        <button className="admin-action-btn success">
                          Confirm VIP
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* VIP Users Management */}
          <div className="admin-data-card">
            <h3 className="admin-data-title">
              <Star className="admin-icon-inline" />
              VIP Users Management
            </h3>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>VIP Status</th>
                    <th>VIP Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => u.isVIP || u.role === 'admin').map((user) => (
                    <tr key={user._id}>
                      <td className="admin-user-name">{user.username}</td>
                      <td className="admin-user-email">{user.email}</td>
                      <td>
                        <span className={`admin-status-badge ${user.isVIP ? 'vip' : 'inactive'}`}>
                          {user.isVIP ? 'VIP' : 'Not VIP'}
                        </span>
                      </td>
                      <td>{user.vipExpiry ? new Date(user.vipExpiry).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <button className="admin-action-btn primary">
                          Toggle VIP
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="admin-settings-card">
          <h3 className="admin-settings-title">System Settings</h3>

          <div className="admin-settings-section">
            <h4 className="admin-settings-section-title">API Configuration</h4>
            <div className="admin-settings-fields">
              <div className="admin-settings-field">
                <label className="admin-settings-label">Football Data API Key</label>
                <input
                  type="password"
                  className="admin-settings-input"
                  placeholder="••••••••"
                />
              </div>
              <div className="admin-settings-field">
                <label className="admin-settings-label">TheOddsAPI Key</label>
                <input
                  type="password"
                  className="admin-settings-input"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="admin-settings-section">
            <h4 className="admin-settings-section-title">Prediction Settings</h4>
            <div className="admin-settings-fields">
              <div className="admin-settings-field">
                <label className="admin-settings-label">Home Advantage Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue="1.2"
                  className="admin-settings-input"
                />
              </div>
              <div className="admin-settings-field">
                <label className="admin-settings-label">Update Frequency (hours)</label>
                <input
                  type="number"
                  defaultValue="6"
                  className="admin-settings-input"
                />
              </div>
            </div>
          </div>

          <button className="admin-settings-save-btn">
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default Admin;
