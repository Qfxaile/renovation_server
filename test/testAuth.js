const axios = require('axios');

async function testHello() {
  try {
    const response = await axios.get('http://localhost:3000/api/hello');
    console.log('✅ 接口响应:', response.data);

    // 验证是否返回 "HelloWorld"
    if (response.data.message === 'HelloWorld') {
      console.log('✔️ 测试通过');
    } else {
      console.error('❌ 意外的响应内容');
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

testHello();