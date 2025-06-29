const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');

router.route('/projects')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router.route('/projects/:id')
  .get(projectController.getProjectById)
  .put(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;