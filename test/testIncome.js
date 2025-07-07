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
            password: 'admin123'
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

// 测试创建收入记录
async function testCreateIncome() {
    try {
        const newIncome = {
            ProjectID: projectId,
            Date: '2025-07-01',
            Project: '测试项目',
            PaymentMethod: '银行转账',
            Amount: 50000,
            Notes: '首期款'
        };

        const response = await apiClient.post('/incomes', newIncome);
        console.log('✅ 创建收入记录成功:', response.data);
        return response.data.IncomeID;
    } catch (error) {
        console.error('❌ 创建收入记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试获取所有收入记录
async function testGetAllIncomes() {
    try {
        const response = await apiClient.get('/incomes');
        console.log('✅ 获取所有收入记录成功:', response.data);
    } catch (error) {
        console.error('❌ 获取所有收入记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试根据项目 ID 获取收入记录
async function testGetIncomesByProjectId() {
    try {
        const response = await apiClient.get(`/incomes/project/${projectId}`);
        console.log('✅ 根据项目 ID 获取收入记录成功:', response.data);
    } catch (error) {
        console.error('❌ 根据项目 ID 获取收入记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试更新收入记录
async function testUpdateIncome(id) {
    try {
        const updatedData = {
            Amount: 60000,
            Notes: '更新后的首期款'
        };

        const response = await apiClient.put(`/incomes/${id}`, updatedData);
        console.log('✅ 更新收入记录成功:', response.data);
    } catch (error) {
        console.error('❌ 更新收入记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试删除收入记录
async function testDeleteIncome(id) {
    try {
        await apiClient.delete(`/incomes/${id}`);
        console.log('✅ 删除收入记录成功');
    } catch (error) {
        console.error('❌ 删除收入记录失败:', error.response?.data?.message || error.message);
    }
}

// 执行完整测试流程
async function runTests() {
    console.log('🚀 开始执行 Income API 测试...\n');

    await login();
    await getProjectId();

    let incomeId = await testCreateIncome();
    if (!incomeId) {
        console.warn('⚠️ 无法获取收入记录 ID，跳过更新和删除测试');
        return;
    }

    await testGetAllIncomes();
    await testGetIncomesByProjectId();
    await testUpdateIncome(incomeId);
    // await testDeleteIncome(incomeId);

    console.log('\n🎉 所有 Income 测试完成');
}

runTests();