-- 创建数据库
CREATE DATABASE IF NOT EXISTS renonation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 使用这个数据库
USE renonation_db;

-- 创建用户表
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    Username VARCHAR(100) NOT NULL UNIQUE COMMENT '用户名',
    Password VARCHAR(255) NOT NULL COMMENT '密码',
    Role VARCHAR(50) NOT NULL COMMENT '角色（如：admin, user）',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);

-- 创建工程表
CREATE TABLE IF NOT EXISTS Projects (
    ProjectID INT AUTO_INCREMENT PRIMARY KEY COMMENT '项目ID',
    ProjectName VARCHAR(255) NOT NULL COMMENT '项目名称',
    ProjectAddress VARCHAR(255) DEFAULT NULL COMMENT '项目地址',
    StartDate DATETIME NULL DEFAULT NULL COMMENT '开工日期',
    EndDate DATETIME NULL DEFAULT NULL COMMENT '竣工日期',
    ContractAmount DECIMAL(15, 2) DEFAULT 0.00 COMMENT '合同金额',
    ClientName VARCHAR(100) COMMENT '客户姓名',
    ClientContact VARCHAR(100) COMMENT '客户联系方式',
    Notes TEXT COMMENT '备注'
);

-- 创建收入记录表
CREATE TABLE IF NOT EXISTS Income (
    IncomeID INT AUTO_INCREMENT PRIMARY KEY COMMENT '收入记录ID',
    ProjectID INT NOT NULL COMMENT '项目ID',
    Date DATETIME NULL DEFAULT NULL COMMENT '日期',
    PaymentMethod VARCHAR(100) COMMENT '付款方式',
    Amount DECIMAL(15, 2) DEFAULT 0.00 COMMENT '收款金额',
    Notes TEXT COMMENT '备注',
    FOREIGN KEY (ProjectID) REFERENCES Projects (ProjectID) ON DELETE CASCADE
);

-- 创建材料明细表
CREATE TABLE IF NOT EXISTS Materials (
    MaterialID INT AUTO_INCREMENT PRIMARY KEY COMMENT '材料ID',
    ProjectID INT NOT NULL COMMENT '项目ID',
    Date DATETIME NULL DEFAULT NULL COMMENT '日期',
    MaterialName VARCHAR(255) NOT NULL COMMENT '材料名称',
    Specification VARCHAR(255) COMMENT '规格型号',
    Quantity DECIMAL(10, 3) COMMENT '数量',
    UnitPrice DECIMAL(15, 2) DEFAULT 0.00 COMMENT '单价',
    TotalAmount DECIMAL(15, 2) DEFAULT 0.00 COMMENT '总金额',
    Notes TEXT COMMENT '备注',
    FOREIGN KEY (ProjectID) REFERENCES Projects (ProjectID) ON DELETE CASCADE
);

-- 创建工人工资表
CREATE TABLE IF NOT EXISTS Labor (
    LaborID INT AUTO_INCREMENT PRIMARY KEY COMMENT '工资记录ID',
    ProjectID INT NOT NULL COMMENT '项目ID',
    LaborType VARCHAR(100) NOT NULL COMMENT '工人类型',
    Name VARCHAR(100) NOT NULL COMMENT '姓名',
    WorkDate DATETIME NULL DEFAULT NULL COMMENT '工作日期',
    WorkDescription TEXT COMMENT '工作内容',
    WageRate DECIMAL(15, 2) DEFAULT 0.00 COMMENT '工资标准',
    DaysWorked DECIMAL(5, 2) DEFAULT 0.00 COMMENT '工作天数',
    TotalWage DECIMAL(15, 2) DEFAULT 0.00 COMMENT '总工资',
    Notes TEXT COMMENT '备注',
    FOREIGN KEY (ProjectID) REFERENCES Projects (ProjectID) ON DELETE CASCADE
);

-- 创建其他支出记录表
CREATE TABLE IF NOT EXISTS OtherExpenses (
    ExpenseID INT AUTO_INCREMENT PRIMARY KEY COMMENT '支出记录ID',
    ProjectID INT NOT NULL COMMENT '项目ID',
    Date DATETIME NULL DEFAULT NULL COMMENT '日期',
    ExpenseType VARCHAR(100) NOT NULL COMMENT '支出类型',
    ExpenseDescription TEXT NOT NULL COMMENT '支出明细',
    Amount DECIMAL(15, 2) DEFAULT 0.00 COMMENT '金额',
    Notes TEXT COMMENT '备注',
    FOREIGN KEY (ProjectID) REFERENCES Projects (ProjectID) ON DELETE CASCADE
);

-- 创建工程总账单
CREATE TABLE IF NOT EXISTS ProjectSummary (
    ProjectID INT PRIMARY KEY COMMENT '项目ID',
    TotalMaterials DECIMAL(15, 2) DEFAULT 0.00 COMMENT '材料总支出',
    ElectricianWages DECIMAL(15, 2) DEFAULT 0.00 COMMENT '水电工工资',
    CarpenterWages DECIMAL(15, 2) DEFAULT 0.00 COMMENT '木工工资',
    MasonWages DECIMAL(15, 2) DEFAULT 0.00 COMMENT '瓦工工资',
    PainterWages DECIMAL(15, 2) DEFAULT 0.00 COMMENT '油漆工工资',
    OtherExpensesTotal DECIMAL(15, 2) DEFAULT 0.00 COMMENT '其他总支出',
    TotalExpenses DECIMAL(15, 2) DEFAULT 0.00 COMMENT '总支出',
    TotalIncome DECIMAL(15, 2) DEFAULT 0.00 COMMENT '总收入',
    TotalProfit DECIMAL(15, 2) DEFAULT 0.00 COMMENT '利润总额',
    FOREIGN KEY (ProjectID) REFERENCES Projects (ProjectID) ON DELETE CASCADE
);