const axios = require('axios');

// 配置基础 URL
const API_URL = 'http://localhost:3000/api';

// 创建 Axios 实例
const apiClient = axios.create({
    baseURL: API_URL,
});

let authToken = null;
let projectId = null;

// 模拟登录获取 Token
async function login() {
    try {
        const response = await apiClient.post('/auth/login', {
            username: 'admin',
            password: 'password123'
        });

        authToken = response.data.token;
        console.log('✅ 登录成功，Token 已获取');
    } catch (error) {
        console.error('❌ 登录失败:', error.response?.data?.message || error.message);
        process.exit(1);
    }
}

// 获取项目 ID
async function getProjectId() {
    try {
        const response = await apiClient.get('/projects');
        if (response.data && response.data.length > 0) {
            projectId = response.data[0].ProjectID;
            console.log('✅ 获取项目 ID 成功:', projectId);
        } else {
            console.error('❌ 未找到项目，请先创建项目');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ 获取项目 ID 失败:', error.response?.data?.message || error.message);
        process.exit(1);
    }
}

// 设置请求拦截器，自动添加 Token
apiClient.interceptors.request.use(config => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
}, error => Promise.reject(error));

// 测试创建其他支出记录
async function testCreateOtherExpense() {
    try {
        const newExpense = {
            ProjectID: projectId,
            Date: '2025-07-01',
            ExpenseType: '设计费',
            ExpenseDescription: '室内设计方案',
            Amount: 5000.00,
            Notes: '一次性费用'
        };

        const response = await apiClient.post('/other-expenses', newExpense);
        console.log('✅ 创建其他支出记录成功:', response.data);
        return response.data.ExpenseID;
    } catch (error) {
        console.error('❌ 创建其他支出记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试获取所有其他支出记录
async function testGetAllOtherExpenses() {
    try {
        const response = await apiClient.get('/other-expenses');
        console.log('✅ 获取所有其他支出记录成功:', response.data);
    } catch (error) {
        console.error('❌ 获取所有其他支出记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试根据项目 ID 获取其他支出记录
async function testGetOtherExpensesByProjectId() {
    try {
        const response = await apiClient.get(`/other-expenses/project/${projectId}`);
        console.log('✅ 根据项目 ID 获取其他支出记录成功:', response.data);
    } catch (error) {
        console.error('❌ 根据项目 ID 获取其他支出记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试更新其他支出记录
async function testUpdateOtherExpense(id) {
    try {
        const updatedData = {
            Amount: 6000.00,
            Notes: '更新后的设计费'
        };

        const response = await apiClient.put(`/other-expenses/${id}`, updatedData);
        console.log('✅ 更新其他支出记录成功:', response.data);
    } catch (error) {
        console.error('❌ 更新其他支出记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试删除其他支出记录
async function testDeleteOtherExpense(id) {
    try {
        await apiClient.delete(`/other-expenses/${id}`);
        console.log('✅ 删除其他支出记录成功');
    } catch (error) {
        console.error('❌ 删除其他支出记录失败:', error.response?.data?.message || error.message);
    }
}

// 执行完整测试流程
async function runTests() {
    console.log('🚀 开始执行 OtherExpenses API 测试...\n');

    await login();
    await getProjectId();

    let expenseId = await testCreateOtherExpense();
    if (!expenseId) {
        console.warn('⚠️ 无法获取其他支出记录 ID，跳过更新和删除测试');
        return;
    }

    await testGetAllOtherExpenses();
    await testGetOtherExpensesByProjectId();
    await testUpdateOtherExpense(expenseId);
    await testDeleteOtherExpense(expenseId);

    console.log('\n🎉 所有 OtherExpenses 测试完成');
}

runTests();