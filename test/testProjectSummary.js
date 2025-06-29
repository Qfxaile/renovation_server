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

// 测试创建工程总账单
async function testCreateProjectSummary() {
    try {
        const newSummary = {
            ProjectID: projectId,
            TotalMaterials: 50000.00,
            ElectricianWages: 10000.00,
            CarpenterWages: 12000.00,
            MasonWages: 8000.00,
            PainterWages: 5000.00,
            OtherExpensesTotal: 5000.00,
            TotalExpenses: 80000.00,
            TotalIncome: 100000.00,
            TotalProfit: 20000.00
        };

        const response = await apiClient.post('/project-summary', newSummary);
        console.log('✅ 创建工程总账单成功:', response.data);
        return projectId; // 返回项目 ID，用于后续更新和删除
    } catch (error) {
        console.error('❌ 创建工程总账单失败:', error.response?.data?.message || error.message);
    }
}

// 测试获取所有工程总账单
async function testGetAllProjectSummaries() {
    try {
        const response = await apiClient.get('/project-summary');
        console.log('✅ 获取所有工程总账单成功:', response.data);
    } catch (error) {
        console.error('❌ 获取所有工程总账单失败:', error.response?.data?.message || error.message);
    }
}

// 测试根据项目 ID 获取工程总账单
async function testGetProjectSummaryById() {
    try {
        const response = await apiClient.get(`/project-summary/${projectId}`);
        console.log('✅ 根据项目 ID 获取工程总账单成功:', response.data);
    } catch (error) {
        console.error('❌ 根据项目 ID 获取工程总账单失败:', error.response?.data?.message || error.message);
    }
}

// 测试更新工程总账单
async function testUpdateProjectSummary() {
    try {
        const updatedData = {
            TotalMaterials: 60000.00,
            TotalProfit: 30000.00
        };

        const response = await apiClient.put(`/project-summary/${projectId}`, updatedData);
        console.log('✅ 更新工程总账单成功:', response.data);
    } catch (error) {
        console.error('❌ 更新工程总账单失败:', error.response?.data?.message || error.message);
    }
}

// 测试删除工程总账单
async function testDeleteProjectSummary() {
    try {
        await apiClient.delete(`/project-summary/${projectId}`);
        console.log('✅ 删除工程总账单成功');
    } catch (error) {
        console.error('❌ 删除工程总账单失败:', error.response?.data?.message || error.message);
    }
}

// 执行完整测试流程
async function runTests() {
    console.log('🚀 开始执行 ProjectSummary API 测试...\n');

    await login();
    await getProjectId();

    await testCreateProjectSummary();
    await testGetAllProjectSummaries();
    await testGetProjectSummaryById();
    await testUpdateProjectSummary();
    await testDeleteProjectSummary();

    console.log('\n🎉 所有 ProjectSummary 测试完成');
}

runTests();