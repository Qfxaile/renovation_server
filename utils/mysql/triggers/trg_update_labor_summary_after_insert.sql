-- 工人工资插入触发器
CREATE TRIGGER trg_update_labor_summary_after_insert
AFTER INSERT ON Labor
FOR EACH ROW
BEGIN
    DECLARE total_electrician_wages DECIMAL(15, 2);
    DECLARE total_carpenter_wages DECIMAL(15, 2);
    DECLARE total_mason_wages DECIMAL(15, 2);
    DECLARE total_painter_wages DECIMAL(15, 2);
    DECLARE total_other_wages DECIMAL(15, 2);

    -- 计算各类工人的工资
    SELECT SUM(TotalWage) INTO total_electrician_wages
    FROM Labor
    WHERE ProjectID = NEW.ProjectID AND LaborType = 'Electrician';

    SELECT SUM(TotalWage) INTO total_carpenter_wages
    FROM Labor
    WHERE ProjectID = NEW.ProjectID AND LaborType = 'Carpenter';

    SELECT SUM(TotalWage) INTO total_mason_wages
    FROM Labor
    WHERE ProjectID = NEW.ProjectID AND LaborType = 'Mason';

    SELECT SUM(TotalWage) INTO total_painter_wages
    FROM Labor
    WHERE ProjectID = NEW.ProjectID AND LaborType = 'Painter';

    SELECT SUM(TotalWage) INTO total_other_wages
    FROM Labor
    WHERE ProjectID = NEW.ProjectID AND LaborType = 'Other';

    -- 更新项目总账单
    UPDATE ProjectSummary
    SET ElectricianWages = IFNULL(total_electrician_wages, 0),
        CarpenterWages = IFNULL(total_carpenter_wages, 0),
        MasonWages = IFNULL(total_mason_wages, 0),
        PainterWages = IFNULL(total_painter_wages, 0),
        OtherWages = IFNULL(total_other_wages, 0),
        TotalWages = IFNULL(total_electrician_wages, 0) + IFNULL(total_carpenter_wages, 0) + IFNULL(total_mason_wages, 0) + IFNULL(total_painter_wages, 0) + IFNULL(total_other_wages, 0),
       TotalExpenses = (
            SELECT IFNULL(TotalMaterials, 0) + IFNULL(total_electrician_wages, 0) + IFNULL(total_carpenter_wages, 0) + IFNULL(total_mason_wages, 0) + IFNULL(total_painter_wages, 0) + IFNULL(total_other_wages, 0) + IFNULL(OtherExpensesTotal, 0)
            FROM (SELECT TotalMaterials, TotalWages, OtherExpensesTotal FROM ProjectSummary WHERE ProjectID = NEW.ProjectID) AS tmp
        ),
        TotalProfit = (
            SELECT IFNULL(TotalIncome, 0) - (IFNULL(TotalMaterials, 0) + IFNULL(TotalWages, 0) + IFNULL(OtherExpensesTotal, 0))
            FROM (SELECT TotalIncome, TotalMaterials, TotalWages, OtherExpensesTotal FROM ProjectSummary WHERE ProjectID = NEW.ProjectID) AS tmp2
        )
    WHERE ProjectID = NEW.ProjectID;
END;