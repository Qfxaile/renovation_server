-- 工人工资插入触发器
CREATE TRIGGER trg_update_labor_summary_after_delete
AFTER DELETE ON Labor
FOR EACH ROW
BEGIN
    DECLARE total_electrician_wages DECIMAL(15, 2);
    DECLARE total_carpenter_wages DECIMAL(15, 2);
    DECLARE total_mason_wages DECIMAL(15, 2);
    DECLARE total_painter_wages DECIMAL(15, 2);

    -- 计算各类工人的工资
    SELECT SUM(TotalWage) INTO total_electrician_wages
    FROM Labor
    WHERE ProjectID = OLD.ProjectID AND LaborType = 'Electrician';

    SELECT SUM(TotalWage) INTO total_carpenter_wages
    FROM Labor
    WHERE ProjectID = OLD.ProjectID AND LaborType = 'Carpenter';

    SELECT SUM(TotalWage) INTO total_mason_wages
    FROM Labor
    WHERE ProjectID = OLD.ProjectID AND LaborType = 'Mason';

    SELECT SUM(TotalWage) INTO total_painter_wages
    FROM Labor
    WHERE ProjectID = OLD.ProjectID AND LaborType = 'Painter';

    -- 更新项目总账单
    UPDATE ProjectSummary
    SET ElectricianWages = IFNULL(total_electrician_wages, 0),
        CarpenterWages = IFNULL(total_carpenter_wages, 0),
        MasonWages = IFNULL(total_mason_wages, 0),
        PainterWages = IFNULL(total_painter_wages, 0),
       TotalExpenses = IFNULL(total_electrician_wages, 0) + IFNULL(total_carpenter_wages, 0) + IFNULL(total_mason_wages, 0) + IFNULL(total_painter_wages, 0) + (
            SELECT IFNULL(OtherExpensesTotal, 0) FROM (SELECT OtherExpensesTotal FROM ProjectSummary WHERE ProjectID = OLD.ProjectID) AS tmp
        ),
        TotalProfit = IFNULL((SELECT IFNULL(TotalIncome, 0) FROM (SELECT TotalIncome FROM ProjectSummary WHERE ProjectID = OLD.ProjectID) AS tmp2), 0) - (
            IFNULL(total_electrician_wages, 0) + IFNULL(total_carpenter_wages, 0) + IFNULL(total_mason_wages, 0) + IFNULL(total_painter_wages, 0) + (
                SELECT IFNULL(OtherExpensesTotal, 0) FROM (SELECT OtherExpensesTotal FROM ProjectSummary WHERE ProjectID = OLD.ProjectID) AS tmp
            )
        )
    WHERE ProjectID = OLD.ProjectID;
END;