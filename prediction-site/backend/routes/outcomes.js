const express = require('express');
const Match = require('../models/Match');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get outcomes with filtering
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, days, date } = req.query;
    const user = await require('../models/User').findById(req.user.id);

    let query = {};

    // Date filtering
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (days) {
      const daysAgo = parseInt(days);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      query.date = { $gte: startDate };
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.date = { $gte: thirtyDaysAgo };
    }

    // VIP filtering - non-VIP users can't see VIP outcomes
    if (!user.isVIP) {
      query.isVIP = { $ne: true };
    }

    const matches = await Match.find(query)
      .populate('outcomes.outcomeSetBy', 'username')
      .sort({ date: -1 })
      .select('homeTeam awayTeam date league predictions outcomes isVIP homeGoals awayGoals');

    // Filter by prediction type if specified
    let filteredMatches = matches;
    if (type && type !== 'all') {
      filteredMatches = matches.filter(match =>
        match.outcomes && match.outcomes.some(outcome => outcome.predictionType === type)
      );
    }

    // Group by prediction type for the frontend
    const outcomesByType = {
      todays: [],
      topPicks: [],
      vip: [],
      all: []
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filteredMatches.forEach(match => {
      const matchData = {
        id: match._id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: match.date,
        league: match.league,
        isVIP: match.isVIP,
        homeGoals: match.homeGoals,
        awayGoals: match.awayGoals,
        outcomes: match.outcomes || []
      };

      // Today's predictions
      if (match.date >= today) {
        outcomesByType.todays.push(matchData);
      }

      // Top picks (value bets)
      if (match.predictions.some(p => p.valueBet)) {
        outcomesByType.topPicks.push(matchData);
      }

      // VIP predictions
      if (match.isVIP) {
        outcomesByType.vip.push(matchData);
      }

      // All predictions
      outcomesByType.all.push(matchData);
    });

    res.json(outcomesByType);
  } catch (error) {
    console.error('Error fetching outcomes:', error);
    res.status(500).json({ error: 'Failed to fetch outcomes' });
  }
});

// Admin: Set prediction outcome
router.put('/:matchId/outcome', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { predictionType, prediction, actualResult } = req.body;

    const match = await Match.findById(req.params.matchId);

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Find or create outcome entry
    let outcomeIndex = match.outcomes.findIndex(
      o => o.predictionType === predictionType && o.prediction === prediction
    );

    if (outcomeIndex === -1) {
      // Create new outcome entry
      match.outcomes.push({
        predictionType,
        prediction,
        actualResult,
        outcomeSetBy: req.user.id,
        outcomeSetAt: new Date()
      });
    } else {
      // Update existing outcome
      match.outcomes[outcomeIndex].actualResult = actualResult;
      match.outcomes[outcomeIndex].outcomeSetBy = req.user.id;
      match.outcomes[outcomeIndex].outcomeSetAt = new Date();
    }

    await match.save();

    res.json({
      success: true,
      message: 'Outcome updated successfully',
      outcome: match.outcomes.find(o => o.predictionType === predictionType && o.prediction === prediction)
    });
  } catch (error) {
    console.error('Error updating outcome:', error);
    res.status(500).json({ error: 'Failed to update outcome' });
  }
});

// Admin: Bulk set outcomes for a match
router.put('/:matchId/outcomes', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { outcomes } = req.body;

    const match = await Match.findById(req.params.matchId);

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Update outcomes
    outcomes.forEach(outcomeData => {
      const { predictionType, prediction, actualResult } = outcomeData;

      let outcomeIndex = match.outcomes.findIndex(
        o => o.predictionType === predictionType && o.prediction === prediction
      );

      if (outcomeIndex === -1) {
        match.outcomes.push({
          predictionType,
          prediction,
          actualResult,
          outcomeSetBy: req.user.id,
          outcomeSetAt: new Date()
        });
      } else {
        match.outcomes[outcomeIndex].actualResult = actualResult;
        match.outcomes[outcomeIndex].outcomeSetBy = req.user.id;
        match.outcomes[outcomeIndex].outcomeSetAt = new Date();
      }
    });

    await match.save();

    res.json({
      success: true,
      message: 'Outcomes updated successfully',
      outcomes: match.outcomes
    });
  } catch (error) {
    console.error('Error updating outcomes:', error);
    res.status(500).json({ error: 'Failed to update outcomes' });
  }
});

// Get available dates for navigation
router.get('/dates', authenticateToken, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);

    let query = {};
    if (!user.isVIP) {
      query.isVIP = { $ne: true };
    }

    const dates = await Match.find(query)
      .distinct('date')
      .sort({ date: -1 })
      .limit(30); // Last 30 days

    res.json(dates.map(date => date.toISOString().split('T')[0]));
  } catch (error) {
    console.error('Error fetching dates:', error);
    res.status(500).json({ error: 'Failed to fetch dates' });
  }
});

module.exports = router;
