import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { saveAs } from 'file-saver';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#4CAF50', '#f44336', '#FFC107'];

function exportToJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, `test-results-${new Date().toISOString()}.json`);
}

function exportToCSV(data) {
  const headers = ['Test Name', 'Status', 'Suite', 'Error Message'];
  const rows = [headers];

  // Add test results
  data.failedTests.forEach(test => {
    rows.push([
      test.test,
      'Failed',
      test.suite,
      test.error[0]?.replace(/,/g, ';')
    ]);
  });

  const csvContent = rows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `test-results-${new Date().toISOString()}.csv`);
}

function generatePDFReport(data) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Test Results Report', 20, 20);

  // Add summary
  doc.setFontSize(14);
  doc.text(`Total Tests: ${data.summary.totalTests}`, 20, 40);
  doc.text(`Passed: ${data.summary.passedTests}`, 20, 50);
  doc.text(`Failed: ${data.summary.failedTests}`, 20, 60);

  // Add recommendations
  if (data.recommendations?.length > 0) {
    doc.text('Recommendations:', 20, 80);
    data.recommendations.forEach((rec, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${rec.message}`, 30, 90 + (index * 10));
    });
  }

  doc.save(`test-report-${new Date().toISOString()}.pdf`);
}

export function TestDashboard({ testResults }) {
  const { summary, trends, failureAnalysis } = testResults;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Test Analytics Dashboard</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={() => exportToJSON(testResults)}
            sx={{ mr: 1 }}
          >
            Export JSON
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={() => exportToCSV(testResults)}
            sx={{ mr: 1 }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={() => generatePDFReport(testResults)}
          >
            Export PDF
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Test Summary</Typography>
            <Box mt={2}>
              <Typography>Total Tests: {summary.totalTests}</Typography>
              <Typography color="success.main">
                Passed: {summary.passedTests}
              </Typography>
              <Typography color="error.main">
                Failed: {summary.failedTests}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Pass Rate Trend */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pass Rate Trend</Typography>
            <LineChart width={600} height={300} data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="passRate" 
                stroke="#4CAF50" 
                name="Pass Rate %" 
              />
            </LineChart>
          </Paper>
        </Grid>

        {/* Failure Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Failure Analysis</Typography>
            <PieChart width={400} height={300}>
              <Pie
                data={failureAnalysis}
                cx={200}
                cy={150}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {failureAnalysis.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>

        {/* Recent Failures */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Recent Test Failures</Typography>
            <Box mt={2}>
              {testResults.failedTests.map((failure, index) => (
                <Box key={index} mb={2} p={2} bgcolor="error.light" borderRadius={1}>
                  <Typography fontWeight="bold">{failure.test}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {failure.suite}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {failure.error[0]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 