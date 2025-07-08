-- 其他支出插入触发器
CREATE TRIGGER trg_update_other_expenses_summary_after_insert
AFTER INSERT ON OtherExpenses
FOR EACH ROW
BEGIN
    DECLARE total_other_expenses DECIMAL(15, 2);

    -- 计算当前项目的其他总支出
    SELECT SUM(Amount) INTO total_other_expenses
    FROM OtherExpenses
    WHERE ProjectID = NEW.ProjectID;

    -- 使用嵌套子查询避免 MySQL 更新冲突
    UPDATE ProjectSummary
    SET OtherExpensesTotal = IFNULL(total_other_expenses, 0),
        TotalExpenses = (
            SELECT IFNULL(TotalMaterials, 0) + IFNULL(ElectricianWages, 0) + IFNULL(CarpenterWages, 0) + IFNULL(MasonWages, 0) + IFNULL(PainterWages, 0) + IFNULL(total_other_expenses, 0)
            FROM (SELECT TotalMaterials, ElectricianWages, CarpenterWages, MasonWages, PainterWages FROM ProjectSummary WHERE ProjectID = NEW.ProjectID) AS tmp
        ),
        TotalProfit = (
            SELECT IFNULL(TotalIncome, 0) - (IFNULL(TotalMaterials, 0) + IFNULL(ElectricianWages, 0) + IFNULL(CarpenterWages, 0) + IFNULL(MasonWages, 0) + IFNULL(PainterWages, 0) + IFNULL(total_other_expenses, 0))
            FROM (SELECT TotalIncome, TotalMaterials, ElectricianWages, CarpenterWages, MasonWages, PainterWages FROM ProjectSummary WHERE ProjectID = NEW.ProjectID) AS tmp2
        )
    WHERE ProjectID = NEW.ProjectID;
END;