import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  icon: {
    type: String,
  },
  content: {
    type: String,
  },
  order: {
    type: Number,
  },
  pointsReward: {
    type: Number,
    default: 50,
  },
  requiredLevel: {
    type: Number,
    default: 1,
  },
  videoUrls: [{
    title: String,
    url: String,
  }],
  translations: {
    type: Object,
    default: {},
  },
});

const Module = mongoose.model("Module", moduleSchema);
export default Module;
