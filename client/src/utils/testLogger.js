const fs = require('fs');
const path = require('path');

class TestLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../../test-logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  logTestResults(results) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFile = path.join(this.logDir, `test-run-${timestamp}.log`);

    const log = {
      timestamp,
      summary: {
        totalSuites: results.numTotalTestSuites,
        failedSuites: results.numFailedTestSuites,
        totalTests: results.numTotalTests,
        failedTests: results.numFailedTests,
        passedTests: results.numPassedTests
      },
      failedTests: [],
      coverage: results.coverageMap
    };

    // Collect failed test details
    results.testResults.forEach(suite => {
      suite.testResults
        .filter(test => test.status === 'failed')
        .forEach(test => {
          log.failedTests.push({
            suite: suite.testFilePath,
            test: test.title,
            error: test.failureMessages
          });
        });
    });

    fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
    return logFile;
  }

  readLatestLog() {
    const files = fs.readdirSync(this.logDir);
    if (files.length === 0) return null;

    const latestLog = files
      .filter(f => f.endsWith('.log'))
      .sort()
      .reverse()[0];

    return JSON.parse(
      fs.readFileSync(path.join(this.logDir, latestLog), 'utf8')
    );
  }

  analyzeTestTrend() {
    const files = fs.readdirSync(this.logDir)
      .filter(f => f.endsWith('.log'))
      .sort();

    return files.map(file => {
      const log = JSON.parse(
        fs.readFileSync(path.join(this.logDir, file), 'utf8')
      );
      return {
        timestamp: log.timestamp,
        passRate: (log.summary.passedTests / log.summary.totalTests) * 100
      };
    });
  }

  analyzeFailures(results) {
    const analysis = {
      byType: {},
      byComponent: {},
      trends: [],
      commonPatterns: new Map()
    };

    results.failedTests.forEach(failure => {
      // Analyze error type
      const errorType = this.categorizeError(failure.error[0]);
      analysis.byType[errorType] = (analysis.byType[errorType] || 0) + 1;

      // Analyze component
      const component = this.extractComponent(failure.suite);
      analysis.byComponent[component] = (analysis.byComponent[component] || 0) + 1;

      // Analyze error patterns
      const pattern = this.extractErrorPattern(failure.error[0]);
      analysis.commonPatterns.set(
        pattern,
        (analysis.commonPatterns.get(pattern) || 0) + 1
      );
    });

    return analysis;
  }

  categorizeError(error) {
    if (error.includes('TypeError')) return 'Type Error';
    if (error.includes('AssertionError')) return 'Assertion Error';
    if (error.includes('SyntaxError')) return 'Syntax Error';
    if (error.includes('ReferenceError')) return 'Reference Error';
    return 'Other Error';
  }

  extractComponent(path) {
    const match = path.match(/components\/([^/]+)/);
    return match ? match[1] : 'Unknown';
  }

  extractErrorPattern(error) {
    // Remove specific values and keep the pattern
    return error
      .replace(/['"](.*?)['"]/g, 'VALUE')
      .replace(/\d+/g, 'NUMBER')
      .trim();
  }

  generateReport() {
    const latestResults = this.readLatestLog();
    const trends = this.analyzeTestTrend();
    const failures = this.analyzeFailures(latestResults);

    return {
      summary: latestResults.summary,
      trends,
      failures,
      recommendations: this.generateRecommendations(failures)
    };
  }

  generateRecommendations(failures) {
    const recommendations = [];

    // Analyze failure patterns
    if (failures.byType['Type Error'] > 2) {
      recommendations.push({
        priority: 'High',
        message: 'Multiple type errors detected. Consider adding TypeScript or PropTypes.',
        category: 'Type Safety'
      });
    }

    // Analyze component failures
    Object.entries(failures.byComponent).forEach(([component, count]) => {
      if (count > 3) {
        recommendations.push({
          priority: 'High',
          message: `High failure rate in ${component}. Consider code review.`,
          category: 'Component Stability'
        });
      }
    });

    return recommendations;
  }
}

module.exports = new TestLogger(); 