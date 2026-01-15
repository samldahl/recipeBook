const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving (async middleware should not call next)
userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (plaintext) {
  return await bcrypt.compare(plaintext, this.password);
};

module.exports = mongoose.model('User', userSchema);
