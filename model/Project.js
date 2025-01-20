const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    studentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    supervisorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    status: { 
      type: String, 
      enum: ["proposed", "completed"], 
      required: true 
    },
  },
  { 
    collection: "projects",
    timestamps: true 
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;