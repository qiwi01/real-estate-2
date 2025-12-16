const mongoose = require('mongoose');

const LeagueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  teams: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      trim: true
    },
    founded: {
      type: Number
    },
    stadium: {
      type: String,
      trim: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
LeagueSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
LeagueSchema.index({ name: 1 });
LeagueSchema.index({ code: 1 });
LeagueSchema.index({ country: 1 });

module.exports = mongoose.model('League', LeagueSchema);
