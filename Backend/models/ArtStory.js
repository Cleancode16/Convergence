const mongoose = require('mongoose');

const artStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artForm: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    introduction: {
      type: String,
      required: true,
    },
    chapters: [{
      chapterNumber: Number,
      title: String,
      content: String,
      image: String,
    }],
    history: {
      type: String,
      required: true,
    },
    importance: {
      type: String,
      required: true,
    },
    culturalSignificance: {
      type: String,
    },
    modernRelevance: {
      type: String,
    },
    funFacts: [String],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    likesCount: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    generatedBy: {
      type: String,
      default: 'Gemini AI',
    },
  },
  {
    timestamps: true,
  }
);

artStorySchema.index({ artForm: 1, isActive: 1 });
artStorySchema.index({ likesCount: -1 });

module.exports = mongoose.model('ArtStory', artStorySchema);
