-- 收入更新触发器
CREATE TRIGGER trg_update_income_summary_after_update
AFTER UPDATE ON Income
FOR EACH ROW
BEGIN
    DECLARE total_income DECIMAL(15, 2);
    DECLARE total_expenses DECIMAL(15, 2);

    -- 计算当前项目的总收入
    SELECT SUM(Amount) INTO total_income
    FROM Income
    WHERE ProjectID = NEW.ProjectID;

    -- 计算当前项目的总支出
    SELECT TotalMaterials + ElectricianWages + CarpenterWages + MasonWages + PainterWages + OtherExpensesTotal INTO total_expenses
    FROM ProjectSummary
    WHERE ProjectID = NEW.ProjectID;

    -- 更新项目总账单
    UPDATE ProjectSummary
    SET TotalIncome = IFNULL(total_income, 0),
        TotalExpenses = IFNULL(total_expenses, 0),
        TotalProfit = IFNULL(total_income, 0) - IFNULL(total_expenses, 0)
    WHERE ProjectID = NEW.ProjectID;
END;