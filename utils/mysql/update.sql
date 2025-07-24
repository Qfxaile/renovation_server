-- 删除工人工资表中的工资标准字段
ALTER TABLE Labor DROP COLUMN WageRate;

-- 添加其他支出表图片字段
ALTER TABLE OtherExpenses ADD COLUMN Image VARCHAR(255) DEFAULT NULL COMMENT '图片链接' AFTER Amount;

-- 添加材料表单位字段
ALTER TABLE Materials ADD COLUMN Unit VARCHAR(50) COMMENT '单位' AFTER Specification;