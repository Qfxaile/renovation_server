-- 其他支出更新触发器
CREATE TRIGGER trg_update_other_expenses_summary_after_update
AFTER UPDATE ON OtherExpenses
FOR EACH ROW
BEGIN
    DECLARE total_other_expenses DECIMAL(15, 2);

    -- 计算当前项目的其他总支出
    SELECT SUM(Amount) INTO total_other_expenses
    FROM OtherExpenses
    WHERE ProjectID = NEW.ProjectID;

    -- 更新项目总账单
    UPDATE ProjectSummary
    SET OtherExpensesTotal = IFNULL(total_other_expenses, 0),
        TotalExpenses = IFNULL(TotalMaterials, 0) + IFNULL(ElectricianWages, 0) + IFNULL(CarpenterWages, 0) + IFNULL(MasonWages, 0) + IFNULL(PainterWages, 0) + IFNULL(total_other_expenses, 0),
        TotalProfit = IFNULL(TotalIncome, 0) - (IFNULL(TotalMaterials, 0) + IFNULL(ElectricianWages, 0) + IFNULL(CarpenterWages, 0) + IFNULL(MasonWages, 0) + IFNULL(PainterWages, 0) + IFNULL(total_other_expenses, 0))
    WHERE ProjectID = NEW.ProjectID;
END;