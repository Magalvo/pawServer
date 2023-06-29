const router = require('express').Router();
const Project = require('../models/Project.model');
const mongoose = require('mongoose');
const fileUploader = require('../config/cloudinary.config');

//Create a new Project

router.post('/projects', async (req, res, next) => {
  const { title, description, imgUrl } = req.body;

  try {
    const newProject = await Project.create({
      title,
      description,
      imgUrl,
      tasks: []
    });

    res.json(newProject);
  } catch (error) {
    console.log('An error ocurred creating a new project', next(error));
  }
});

//retrieve all projects

router.get('/projects', async (req, res, next) => {
  try {
    //we need to 'populate' the tasks to get all the info
    const allProjects = await Project.find().populate('tasks');
    res.json(allProjects);
  } catch (e) {
    console.log('An error ocurred', e);
    next(e);
  }
});

//Retrieves a specific project
router.get('/projects/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Specified id is not valid' });
    }

    const project = await Project.findById(id).populate('tasks');

    if (!project) {
      return res.status(404).json({ message: 'No Project Found with that ID' });
    }

    res.json(project);
  } catch (e) {
    console.log('An error occurred retrieving your specific project', e);
    next(e);
  }
});

// Update a specific project by id
router.put('/projects/:id', async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    // Check if provided id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Specified id is not valid' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        description
      },
      {
        new: true // We need to pass this to receive the updated values
      }
    ).populate('tasks');

    if (!updatedProject) {
      return res
        .status(404)
        .json({ message: 'No project found with specified id' });
    }

    res.json(updatedProject);
  } catch (e) {
    console.log('An error occurred when updating the project', e);
    next(e);
  }
});

//Deletes the specified project by id
router.delete('/projects/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    //check valid id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'specified id is not valid' });
    }

    await Project.findByIdAndDelete(id);
    res.json({ message: `Project with id ${id} was deleted successfully ` });
  } catch (e) {
    console.log('An error occurred deleting the project', e);
    next(e);
  }
});

//route that receives the image, sends it to cloudinary and returns the image url
router.post('/upload', fileUploader.single('file'), (req, res, next) => {
  try {
    res.json({ fileUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred uploading the image' });
    next(error);
  }
});

module.exports = router;
