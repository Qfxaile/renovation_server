const axios = require('axios');

// 配置基础 URL
const API_URL = 'http://localhost:3000/api';

// 创建 Axios 实例
const apiClient = axios.create({
    baseURL: API_URL,
});

let authToken = null;

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

// 设置请求拦截器，自动添加 Token
apiClient.interceptors.request.use(config => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
}, error => Promise.reject(error));

// 测试获取项目列表
async function testGetProjects() {
    try {
        const response = await apiClient.get('/projects');
        console.log('✅ 获取项目列表成功:', response.data);
        return response.data[0]?.ProjectID; // 返回第一个项目 ID 用于后续测试
    } catch (error) {
        console.error('❌ 获取项目列表失败:', error.response?.data?.message || error.message);
    }
}

// 测试创建项目
async function testCreateProject() {
    try {
        const newProject = {
            ProjectName: `项目-${Date.now()}`,
            ProjectAddress: '测试地址',
            StartDate: '2025-07-01',
            EndDate: '2025-08-01',
            ContractAmount: 100000,
            ClientName: '测试客户',
            ClientContact: '13800001111'
        };

        const response = await apiClient.post('/projects', newProject);
        console.log('✅ 创建项目成功:', response.data);
        return response.data.ProjectID;
    } catch (error) {
        console.error('❌ 创建项目失败:', error.response?.data?.message || error.message);
    }
}

// 测试更新项目
async function testUpdateProject(id) {
    try {
        const updatedData = {
            ProjectName: `已更新项目-${Date.now()}`,
            ContractAmount: 200000
        };

        const response = await apiClient.put(`/projects/${id}`, updatedData);
        console.log('✅ 更新项目成功:', response.data);
    } catch (error) {
        console.error('❌ 更新项目失败:', error.response?.data?.message || error.message);
    }
}

// 测试删除项目
async function testDeleteProject(id) {
    try {
        await apiClient.delete(`/projects/${id}`);
        console.log('✅ 删除项目成功');
    } catch (error) {
        console.error('❌ 删除项目失败:', error.response?.data?.message || error.message);
    }
}

// 执行完整测试流程
async function runTests() {
    console.log('🚀 开始执行 API 测试...\n');

    await login();

    let projectId = await testCreateProject();
    if (!projectId) {
        console.warn('⚠️ 无法获取项目 ID，跳过更新和删除测试');
        return;
    }

    await testGetProjects();
    await testUpdateProject(projectId);
    // await testDeleteProject(projectId);

    console.log('\n🎉 所有测试完成');
}

runTests();