// routes/api.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');
const incomeController = require('../controllers/IncomeController');
const materialsController = require('../controllers/MaterialController');
const laborController = require('../controllers/LaborController');
const otherExpensesController = require('../controllers/OtherExpenseController');
const projectSummaryController = require('../controllers/ProjectSummaryController');
const userController = require('../controllers/UserController');
const accountBookController = require('../controllers/AccountBookController');
const accountEntryController = require('../controllers/AccountEntryController');

// Project API
router.route('/projects')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router.route('/projects/:id')
  .get(projectController.getProjectById)
  .put(projectController.updateProject)
  .delete(projectController.deleteProject);

// 添加根据UserID查询项目的API
router.route('/projects/user/:userId')
  .get(projectController.getProjectByUserId);

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

router.route('/project-summary/:id')
  .get(projectSummaryController.getProjectSummaryById)

// 添加获取单个用户信息的路由
router.route('/users/:userId')
  .get(userController.getUserById);

// 添加修改密码的路由
router.route('/users/:userId/change-password')
  .post(userController.changePassword);

// AccountBook API
router.route('/account-books')
  .get(accountBookController.getAllAccountBooks)
  .post(accountBookController.createAccountBook);

router.route('/account-books/:bookId')
  .get(accountBookController.getAccountBookById)
  .put(accountBookController.updateAccountBook)
  .delete(accountBookController.deleteAccountBook);

// 添加根据UserID查询流水账的API
router.route('/account-books/user/:userId')
  .get(accountBookController.getAccountBooksByUserId);

// AccountEntry API
router.route('/account-entries')
  .get(accountEntryController.getAllAccountEntries)
  .post(accountEntryController.createAccountEntry);

router.route('/account-entries/:entryId')
  .get(accountEntryController.getAccountEntryById)
  .put(accountEntryController.updateAccountEntry)
  .delete(accountEntryController.deleteAccountEntry);

// 添加根据BookID查询流水账记录的API
router.route('/account-entries/book/:bookId')
  .get(accountEntryController.getAccountEntriesByBookId);

// 添加根据UserID查询流水账记录的API
router.route('/account-entries/user/:userId')
  .get(accountEntryController.getAccountEntriesByUserId);

// 添加根据用户ID和年份获取总收入和总支出的路由
router.route('/account-entries/user/:userId/year/:year')
  .get(accountEntryController.getAccountSummaryByUserIdAndYear);

module.exports = router;