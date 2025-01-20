const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      unique: true, 
      required: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ["student", "supervisor"], 
      required: true 
    },
    department: { 
      type: String 
    },
  }, { collection: "users" });



userSchema.pre('save', async function(next) {
  const user = this; 

  if (!user.isModified('password')) {
      return next();
  }

  try {
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;

      next();
  } catch (err) {
      return next(err);
  }
});

userSchema.methods.comparePassword = async function(usersPassword) {
  try {
      const users=this;
      console.log(usersPassword)
      const isMatch = await bcrypt.compare(usersPassword, users.password);
      console.log(isMatch)
      return isMatch;
  } catch (err) {
      throw err;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
