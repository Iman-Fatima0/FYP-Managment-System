const express = require("express");
const Project = require("../model/Project");
const { authorize} = require("../middleware/auth");
const {jwtAuthMiddleware} = require("../middleware/jwt");
const mongoose = require('mongoose'); 

const router = express.Router();

router.post("/createprojects",jwtAuthMiddleware, authorize(['student']), async (req, res) => {
  try {
   
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

const project = await Project.create({title, description, studentId: req.user._id});

    res.status(201).json({ message: "Project created successfully", project});
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/projects",jwtAuthMiddleware , async (req, res) => {
  try {
    let projects;

    if (req.user.role === "student") {
      projects = await Project.find({ studentId: req.user._id });
    } else if (req.user.role === "supervisor") {
      projects = await Project.find();
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/projects/:_id",jwtAuthMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (req.user.role === "student" && project.studentId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/updateprojects/:_id",jwtAuthMiddleware, authorize(['supervisor']), async (req, res) => {
  try {
   
    const { title, description, status, supervisorId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (status) project.status = status;
    if (supervisorId) project.supervisorId = supervisorId;

    await project.save();

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/deleteprojects/:id",jwtAuthMiddleware, authorize(['supervisor']), async (req, res) => {
  try {
  
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.remove();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
