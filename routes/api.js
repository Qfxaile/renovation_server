const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');
const authController = require('../controllers/AuthController');

router.post('/auth/login', (req, res) => authController.login(req, res));

router.route('/projects')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router.route('/projects/:id')
  .get(projectController.getProjectById)
  .put(projectController.updateProject)
  .delete(projectController.deleteProject);

router.get('/hello', (req, res) => res.json({ message: 'Hello World!' }))

module.exports = router;