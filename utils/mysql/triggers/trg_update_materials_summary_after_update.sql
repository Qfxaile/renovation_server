-- 材料总支出更新触发器
CREATE TRIGGER trg_update_materials_summary_after_update
AFTER UPDATE ON Materials
FOR EACH ROW
BEGIN
    DECLARE total_materials DECIMAL(15, 2);

    -- 计算当前项目的材料总支出
    SELECT SUM(TotalAmount) INTO total_materials
    FROM Materials
    WHERE ProjectID = NEW.ProjectID;

    -- 更新项目总账单
    UPDATE ProjectSummary
    SET TotalMaterials = IFNULL(total_materials, 0),
        TotalExpenses = IFNULL(total_materials, 0) + IFNULL(ElectricianWages, 0) + IFNULL(CarpenterWages, 0) + IFNULL(MasonWages, 0) + IFNULL(PainterWages, 0) + IFNULL(OtherExpensesTotal, 0),
        TotalProfit = IFNULL(TotalIncome, 0) - (IFNULL(total_materials, 0) + IFNULL(ElectricianWages, 0) + IFNULL(CarpenterWages, 0) + IFNULL(MasonWages, 0) + IFNULL(PainterWages, 0) + IFNULL(OtherExpensesTotal, 0))
    WHERE ProjectID = NEW.ProjectID;
END;