-- 材料总支出触发器
CREATE TRIGGER trg_update_materials_summary_after_insert
AFTER INSERT ON Materials
FOR EACH ROW
BEGIN
    DECLARE total_materials DECIMAL(15, 2);

    -- 计算当前项目的材料总支出
    SELECT SUM(TotalAmount) INTO total_materials
    FROM Materials
    WHERE ProjectID = NEW.ProjectID;

    -- 使用嵌套子查询避免 MySQL 更新冲突
    UPDATE ProjectSummary
    SET TotalMaterials = IFNULL(total_materials, 0),
        TotalExpenses = (
            SELECT IFNULL(total_materials, 0) + IFNULL(TotalWages, 0) + IFNULL(OtherExpensesTotal, 0)
            FROM (SELECT TotalWages, OtherExpensesTotal FROM ProjectSummary WHERE ProjectID = NEW.ProjectID) AS tmp
        ),
        TotalProfit = (
            SELECT IFNULL(TotalIncome, 0) - (IFNULL(total_materials, 0) + IFNULL(TotalWages, 0) + IFNULL(OtherExpensesTotal, 0))
            FROM (SELECT TotalIncome, TotalWages, OtherExpensesTotal FROM ProjectSummary WHERE ProjectID = NEW.ProjectID) AS tmp2
        )
    WHERE ProjectID = NEW.ProjectID;
END;