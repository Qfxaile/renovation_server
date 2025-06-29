const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');
const incomeController = require('../controllers/IncomeController');
const materialsController = require('../controllers/MaterialsController');
const laborController = require('../controllers/LaborController');
const otherExpensesController = require('../controllers/OtherExpensesController');
const projectSummaryController = require('../controllers/ProjectSummaryController');

// Project API
router.route('/projects')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router.route('/projects/:id')
  .get(projectController.getProjectById)
  .put(projectController.updateProject)
  .delete(projectController.deleteProject);

// Income API
router.route('/incomes')
  .get(incomeController.getAllIncomes)
  .post(incomeController.createIncome);

router.route('/incomes/project/:projectId')
  .get(incomeController.getIncomesByProjectId);

router.route('/incomes/:id')
  .get(incomeController.getIncomeById)
  .put(incomeController.updateIncome)
  .delete(incomeController.deleteIncome);

// Materials API
router.route('/materials')
  .get(materialsController.getAllMaterials)
  .post(materialsController.createMaterial);

router.route('/materials/project/:projectId')
  .get(materialsController.getMaterialsByProjectId);

router.route('/materials/:id')
  .get(materialsController.getMaterialById)
  .put(materialsController.updateMaterial)
  .delete(materialsController.deleteMaterial);

// Labor API
router.route('/labor')
  .get(laborController.getAllLaborRecords)
  .post(laborController.createLaborRecord);

router.route('/labor/project/:projectId')
  .get(laborController.getLaborRecordsByProjectId);

router.route('/labor/:id')
  .get(laborController.getLaborRecordById)
  .put(laborController.updateLaborRecord)
  .delete(laborController.deleteLaborRecord);

// OtherExpenses API
router.route('/other-expenses')
  .get(otherExpensesController.getAllOtherExpenses)
  .post(otherExpensesController.createOtherExpense);

router.route('/other-expenses/project/:projectId')
  .get(otherExpensesController.getOtherExpensesByProjectId);

router.route('/other-expenses/:id')
  .get(otherExpensesController.getOtherExpenseById)
  .put(otherExpensesController.updateDynamicExpense)
  .delete(otherExpensesController.deleteOtherExpense);

// ProjectSummary API
router.route('/project-summary')
  .get(projectSummaryController.getProjectSummary)
  .post(projectSummaryController.createProjectSummary);

router.route('/project-summary/:id')
  .get(projectSummaryController.getProjectSummaryById)
  .put(projectSummaryController.updateProjectSummary)
  .delete(projectSummaryController.deleteProjectSummary);
module.exports = router;