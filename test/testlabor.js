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

// 测试创建工人工资记录
async function testCreateLabor() {
    try {
        const newLabor = {
            ProjectID: projectId,
            LaborType: '水电工',
            Name: '张三',
            WorkDate: '2025-07-01',
            WorkDescription: '安装水电管道',
            WageRate: 300.00,
            DaysWorked: 5.00,
            TotalWage: 1500.00,
            Notes: '水电安装工作'
        };

        const response = await apiClient.post('/labor', newLabor);
        console.log('✅ 创建工人工资记录成功:', response.data);
        return response.data.LaborID;
    } catch (error) {
        console.error('❌ 创建工人工资记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试获取所有工人工资记录
async function testGetAllLaborRecords() {
    try {
        const response = await apiClient.get('/labor');
        console.log('✅ 获取所有工人工资记录成功:', response.data);
    } catch (error) {
        console.error('❌ 获取所有工人工资记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试根据项目 ID 获取工人工资记录
async function testGetLaborRecordsByProjectId() {
    try {
        const response = await apiClient.get(`/labor/project/${projectId}`);
        console.log('✅ 根据项目 ID 获取工人工资记录成功:', response.data);
    } catch (error) {
        console.error('❌ 根据项目 ID 获取工人工资记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试更新工人工资记录
async function testUpdateLabor(id) {
    try {
        const updatedData = {
            DaysWorked: 6.00,
            TotalWage: 1800.00,
            Notes: '更新后的水电安装工作'
        };

        const response = await apiClient.put(`/labor/${id}`, updatedData);
        console.log('✅ 更新工人工资记录成功:', response.data);
    } catch (error) {
        console.error('❌ 更新工人工资记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试删除工人工资记录
async function testDeleteLabor(id) {
    try {
        await apiClient.delete(`/labor/${id}`);
        console.log('✅ 删除工人工资记录成功');
    } catch (error) {
        console.error('❌ 删除工人工资记录失败:', error.response?.data?.message || error.message);
    }
}

// 执行完整测试流程
async function runTests() {
    console.log('🚀 开始执行 Labor API 测试...\n');

    await login();
    await getProjectId();

    let laborId = await testCreateLabor();
    if (!laborId) {
        console.warn('⚠️ 无法获取工人工资记录 ID，跳过更新和删除测试');
        return;
    }

    await testGetAllLaborRecords();
    await testGetLaborRecordsByProjectId();
    await testUpdateLabor(laborId);
    // await testDeleteLabor(laborId);

    console.log('\n🎉 所有 Labor 测试完成');
}

runTests();