const router = require('express').Router();
const Project = require('../models/Project.model');
const Task = require('../models/Task.model');

//Create a new
router.post('/tasks', async (req, res, next) => {
  const { title, description, projectId } = req.body;
  //Create Task
  try {
    const newTask = await Task.create({
      title,
      description,
      project: projectId
    });

    //Update the project with the created task
    await Project.findByIdAndUpdate(projectId, {
      $push: { tasks: newTask._id }
    });

    res.json(newTask);
  } catch (e) {
    console.log('An error acuured creating the task', next(error));
  }
});

module.exports = router;
