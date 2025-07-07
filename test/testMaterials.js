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

// 测试创建材料记录
async function testCreateMaterial() {
    try {
        const newMaterial = {
            ProjectID: projectId,
            Date: '2025-07-01',
            MaterialName: '水泥',
            Specification: '42.5R',
            Quantity: 10.500,
            UnitPrice: 350.00,
            TotalAmount: 3675.00,
            Notes: '基础材料'
        };

        const response = await apiClient.post('/materials', newMaterial);
        console.log('✅ 创建材料记录成功:', response.data);
        return response.data.MaterialID;
    } catch (error) {
        console.error('❌ 创建材料记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试获取所有材料记录
async function testGetAllMaterials() {
    try {
        const response = await apiClient.get('/materials');
        console.log('✅ 获取所有材料记录成功:', response.data);
    } catch (error) {
        console.error('❌ 获取所有材料记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试根据项目 ID 获取材料记录
async function testGetMaterialsByProjectId() {
    try {
        const response = await apiClient.get(`/materials/project/${projectId}`);
        console.log('✅ 根据项目 ID 获取材料记录成功:', response.data);
    } catch (error) {
        console.error('❌ 根据项目 ID 获取材料记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试更新材料记录
async function testUpdateMaterial(id) {
    try {
        const updatedData = {
            Quantity: 12.500,
            TotalAmount: 4375.00,
            Notes: '更新后的基础材料'
        };

        const response = await apiClient.put(`/materials/${id}`, updatedData);
        console.log('✅ 更新材料记录成功:', response.data);
    } catch (error) {
        console.error('❌ 更新材料记录失败:', error.response?.data?.message || error.message);
    }
}

// 测试删除材料记录
async function testDeleteMaterial(id) {
    try {
        await apiClient.delete(`/materials/${id}`);
        console.log('✅ 删除材料记录成功');
    } catch (error) {
        console.error('❌ 删除材料记录失败:', error.response?.data?.message || error.message);
    }
}

// 执行完整测试流程
async function runTests() {
    console.log('🚀 开始执行 Materials API 测试...\n');

    await login();
    await getProjectId();

    let materialId = await testCreateMaterial();
    if (!materialId) {
        console.warn('⚠️ 无法获取材料记录 ID，跳过更新和删除测试');
        return;
    }

    await testGetAllMaterials();
    await testGetMaterialsByProjectId();
    await testUpdateMaterial(materialId);
    // await testDeleteMaterial(materialId);

    console.log('\n🎉 所有 Materials 测试完成');
}

runTests();