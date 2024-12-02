const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const heroSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  primaryAttribute: { type: String, required: true },
  roles: [String],
  counters: [{ type: Number, ref: 'Hero' }],
  synergies: [{ type: Number, ref: 'Hero' }],
  lanes: [String],
  imageUrl: String,
  iconUrl: String,
  matchups: [{
    vsHeroId: Number,
    advantage: Number,
    winRate: Number
  }],
  laneStats: {
    safelane: { presence: Number, winRate: Number },
    midlane: { presence: Number, winRate: Number },
    offlane: { presence: Number, winRate: Number },
    jungle: { presence: Number, winRate: Number }
  }
});

const Hero = mongoose.model('Hero', heroSchema);

module.exports = Hero; 