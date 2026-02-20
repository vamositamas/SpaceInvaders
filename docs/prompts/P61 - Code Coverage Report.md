### Prompt 8.8: Code Coverage Report

```
Generate and verify code coverage meets requirements.

Requirements:
1. Configure code coverage tools:
   - Jest coverage for backend
   - Karma coverage for Angular frontend
   - Generate HTML reports
2. Set coverage thresholds in jest.config.js:
   - Statements: 80%
   - Branches: 75%
   - Functions: 80%
   - Lines: 80%
3. Create coverage report for:
   - Unit tests
   - Integration tests
   - Combined coverage
4. Identify uncovered code paths
5. Write tests for uncovered areas
6. Add coverage badge to README

Configuration:
```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'lcov'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  }
};
```

Tasks:
1. Run coverage: npm run test:coverage
2. Review HTML report in /coverage
3. Identify files below threshold
4. Write additional tests for uncovered code
5. Focus on critical paths first
6. Re-run until thresholds met
7. Add coverage to CI pipeline
8. Generate coverage badge

Deliverable: 80%+ code coverage with report
```
