-- 在新增项目时自动插入项目总账单
CREATE TRIGGER trg_update_summary_after_insert_on_project
AFTER INSERT ON Projects
FOR EACH ROW
BEGIN
    -- 插入新的项目总结记录
    INSERT INTO ProjectSummary (ProjectID, TotalMaterials, ElectricianWages, CarpenterWages, MasonWages, PainterWages, OtherWages, TotalWages, OtherExpensesTotal, TotalExpenses, TotalIncome, TotalProfit)
    VALUES (NEW.ProjectID, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00);
END;