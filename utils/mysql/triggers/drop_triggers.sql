-- 删除已有的材料总支出触发器
DROP TRIGGER trg_update_materials_summary_after_delete;

DROP TRIGGER trg_update_materials_summary_after_insert;

DROP TRIGGER trg_update_materials_summary_after_update;

-- 删除已有的工人工资触发器
DROP TRIGGER trg_update_labor_summary_after_delete;

DROP TRIGGER trg_update_labor_summary_after_insert;

DROP TRIGGER trg_update_labor_summary_after_update;

-- 删除已有的其他支出触发器
DROP TRIGGER trg_update_other_expenses_summary_after_delete;

DROP TRIGGER trg_update_other_expenses_summary_after_insert;

DROP TRIGGER trg_update_other_expenses_summary_after_update;

-- 删除已有的收入触发器
DROP TRIGGER trg_update_income_summary_after_delete;

DROP TRIGGER trg_update_income_summary_after_insert;

DROP TRIGGER trg_update_income_summary_after_update;

-- 删除已有的项目触发器
DROP TRIGGER trg_update_summary_after_insert_on_project;