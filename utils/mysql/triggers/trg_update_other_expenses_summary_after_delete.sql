-- 其他支出插入触发器
CREATE TRIGGER trg_update_other_expenses_summary_after_delete
AFTER DELETE ON OtherExpenses
FOR EACH ROW
BEGIN
    DECLARE total_other_expenses DECIMAL(15, 2);

    -- 计算当前项目的其他总支出
    SELECT SUM(Amount) INTO total_other_expenses
    FROM OtherExpenses
    WHERE ProjectID = OLD.ProjectID;

    -- 使用嵌套子查询避免 MySQL 更新冲突
    UPDATE ProjectSummary
    SET OtherExpensesTotal = IFNULL(total_other_expenses, 0),
        TotalExpenses = (
            SELECT IFNULL(TotalMaterials, 0) + IFNULL(TotalWages, 0) + IFNULL(total_other_expenses, 0)
            FROM (SELECT TotalMaterials, TotalWages FROM ProjectSummary WHERE ProjectID = OLD.ProjectID) AS tmp
        ),
        TotalProfit = (
            SELECT IFNULL(TotalIncome, 0) - (IFNULL(TotalMaterials, 0) + IFNULL(TotalWages, 0) + IFNULL(total_other_expenses, 0))
            FROM (SELECT TotalIncome, TotalMaterials, TotalWages FROM ProjectSummary WHERE ProjectID = OLD.ProjectID) AS tmp2
        )
    WHERE ProjectID = OLD.ProjectID;
END;