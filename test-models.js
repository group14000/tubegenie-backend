/**
 * Test script to verify all AI models work correctly
 * Run with: node test-models.js
 *
 * This script tests content generation with all available models
 */

const models = ['tngtech/deepseek-r1t2-chimera:free', 'z-ai/glm-4.5-air:free'];

const testTopic = 'AI in Healthcare 2025';
const serverUrl = process.env.API_URL || 'http://localhost:5000';

async function testModel(modelId, modelName) {
  console.log(`\n🧪 Testing ${modelName}...`);

  try {
    const response = await fetch(`${serverUrl}/api/content/generate/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: testTopic,
        model: modelId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ ${modelName} FAILED:`, data.error || data.message);
      console.error('   Details:', JSON.stringify(data, null, 2));
      return false;
    }

    if (!data.success || !data.data) {
      console.error(`❌ ${modelName} FAILED: Invalid response structure`);
      return false;
    }

    // Validate response structure
    const required = [
      'titles',
      'description',
      'tags',
      'thumbnailIdeas',
      'scriptOutline',
      'aiModel',
    ];
    const missing = required.filter((field) => !data.data[field]);

    if (missing.length > 0) {
      console.error(`❌ ${modelName} FAILED: Missing fields:`, missing);
      return false;
    }

    // Validate arrays have content
    if (!Array.isArray(data.data.titles) || data.data.titles.length === 0) {
      console.error(`❌ ${modelName} FAILED: No titles generated`);
      return false;
    }

    console.log(`✅ ${modelName} SUCCESS`);
    console.log(
      `   Generated ${data.data.titles.length} titles, ${data.data.tags.length} tags`
    );
    console.log(`   Sample title: "${data.data.titles[0]}"`);
    return true;
  } catch (error) {
    console.error(`❌ ${modelName} ERROR:`, error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting AI Model Tests');
  console.log('==========================');
  console.log(`Server: ${serverUrl}`);
  console.log(`Test Topic: "${testTopic}"`);

  // Check if server is running
  try {
    const healthCheck = await fetch(`${serverUrl}/api/health`);
    if (!healthCheck.ok) {
      console.error(
        '❌ Server health check failed. Make sure the server is running with: pnpm dev'
      );
      process.exit(1);
    }
    console.log('✅ Server is running\n');
  } catch (error) {
    console.error(
      "❌ Cannot connect to server. Make sure it's running with: pnpm dev"
    );
    process.exit(1);
  }

  // Test each model
  const results = [];
  for (const modelId of models) {
    const modelName = modelId.split('/')[1].split(':')[0];
    const success = await testModel(modelId, modelName);
    results.push({ modelId, modelName, success });

    // Wait a bit between requests to avoid rate limiting
    if (models.indexOf(modelId) < models.length - 1) {
      console.log('   Waiting 3 seconds before next test...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  // Summary
  console.log('\n==========================');
  console.log('📊 Test Summary:');
  console.log('==========================');

  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  results.forEach((r) => {
    const status = r.success ? '✅' : '❌';
    console.log(`${status} ${r.modelName}`);
  });

  console.log(
    `\nTotal: ${results.length} | Passed: ${passed} | Failed: ${failed}`
  );

  if (failed > 0) {
    console.log('\n⚠️  Some models failed. Check the error messages above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All models passed!');
    process.exit(0);
  }
}

runTests();
