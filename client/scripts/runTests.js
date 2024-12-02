const { execSync } = require('child_process');
const testLogger = require('../src/utils/testLogger');
const open = require('open');
const express = require('express');

async function runTests() {
  try {
    const output = execSync('npm run test:ci', { encoding: 'utf8' });
    const results = testLogger.logTestResults(JSON.parse(output));
    const analysis = testLogger.generateReport();

    // Start a small server to show results
    const app = express();
    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Test Results Dashboard</title>
            <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
            <script>
              window.testResults = ${JSON.stringify(analysis)};
            </script>
          </head>
          <body>
            <div id="root"></div>
            <script src="/dashboard.js"></script>
          </body>
        </html>
      `);
    });

    const server = app.listen(3001, () => {
      console.log('Test dashboard available at http://localhost:3001');
      open('http://localhost:3001');
    });

  } catch (error) {
    console.error('Test run failed:', error);
    process.exit(1);
  }
}

runTests(); 