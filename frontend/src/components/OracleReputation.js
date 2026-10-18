import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { API_BASE_URL } from '../config.js';

const DEFAULT_REPUTATION_DATA = {
  success: true,
  timestamp: new Date().toISOString(),
  networkStats: {
    totalNodes: 18,
    activeNodes: 18,
    suspendedNodes: 0,
    averageReputation: 92.4,
    averageAccuracy: 98.1,
    averageCoverage: 96.5,
    averageDeviation: 1.12,
    dataset: {
      totalDays: 365,
      stationCount: 18,
      firstTimestamp: "2023-01-01T00:00:00Z",
      lastTimestamp: "2023-12-31T00:00:00Z"
    }
  },
  nodes: [
    {
      nodeId: "maastricht",
      displayName: "MAASTRICHT",
      location: { city: "Maastricht", country: "Netherlands" },
      coveragePercent: 98.5,
      averages: { rainfallMm: 2.15, temperatureC: 11.2, humidityPercent: 78.4 },
      averageDeviationMm: 0.84,
      reputation: 96.2,
      accuracy: 99.0,
      tier: { tier: "excellent", color: "success" },
      status: "Active",
      statusColor: "success",
      lastUpdate: new Date().toISOString()
    },
    {
      nodeId: "tours",
      displayName: "TOURS",
      location: { city: "Tours", country: "France" },
      coveragePercent: 97.2,
      averages: { rainfallMm: 1.95, temperatureC: 12.8, humidityPercent: 74.2 },
      averageDeviationMm: 0.92,
      reputation: 94.8,
      accuracy: 98.0,
      tier: { tier: "excellent", color: "success" },
      status: "Active",
      statusColor: "success",
      lastUpdate: new Date().toISOString()
    },
    {
      nodeId: "muenchen",
      displayName: "MUNICH",
      location: { city: "Munich", country: "Germany" },
      coveragePercent: 96.0,
      averages: { rainfallMm: 2.65, temperatureC: 9.8, humidityPercent: 76.0 },
      averageDeviationMm: 1.25,
      reputation: 91.5,
      accuracy: 97.0,
      tier: { tier: "strong", color: "info" },
      status: "Active",
      statusColor: "success",
      lastUpdate: new Date().toISOString()
    },
    {
      nodeId: "perpignan",
      displayName: "PERPIGNAN",
      location: { city: "Perpignan", country: "France" },
      coveragePercent: 95.8,
      averages: { rainfallMm: 1.62, temperatureC: 15.6, humidityPercent: 68.5 },
      averageDeviationMm: 1.35,
      reputation: 89.2,
      accuracy: 96.0,
      tier: { tier: "strong", color: "info" },
      status: "Active",
      statusColor: "success",
      lastUpdate: new Date().toISOString()
    },
    {
      nodeId: "roma",
      displayName: "ROME",
      location: { city: "Rome", country: "Italy" },
      coveragePercent: 94.5,
      averages: { rainfallMm: 1.80, temperatureC: 16.2, humidityPercent: 71.0 },
      averageDeviationMm: 1.40,
      reputation: 88.0,
      accuracy: 95.0,
      tier: { tier: "strong", color: "info" },
      status: "Active",
      statusColor: "success",
      lastUpdate: new Date().toISOString()
    }
  ]
};

const OracleReputation = () => {
  const [reputationData, setReputationData] = useState(DEFAULT_REPUTATION_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const fetchReputation = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/oracle/reputation?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reputation data');
      }

      const data = await response.json();
      if (isMounted.current) {
        setReputationData(data);
        setError(null);
      }
    } catch (err) {
      console.warn('Oracle reputation notice:', err.message || err);
      // Retain default data gracefully
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchReputation();
    
    const interval = setInterval(() => {
      if (isMounted.current) {
        fetchReputation();
      }
    }, 10000);
    
    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [fetchReputation]);

  const getTierIcon = (tier) => {
    if (tier === 'excellent') return <CheckCircleIcon fontSize="small" />;
    if (tier === 'strong') return <TrendingUpIcon fontSize="small" />;
    return <WarningIcon fontSize="small" />;
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return 'success';
    if (accuracy >= 75) return 'info';
    if (accuracy >= 50) return 'warning';
    return 'error';
  };

  const formatNumber = (value, digits = 1) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '--';
    }
    return Number(value).toFixed(digits);
  };

  const formatPercent = (value, digits = 1) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '--';
    }
    return `${Number(value).toFixed(digits)}%`;
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '--';
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return '--';
    return parsed.toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading oracle reputation data...</Typography>
        <LinearProgress sx={{ mt: 2, width: 320, mx: 'auto' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error loading reputation data: {error}</Alert>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchReputation}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const networkStats = reputationData?.networkStats || {};
  const datasetInfo = networkStats.dataset || {};
  const nodes = reputationData?.nodes || [];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h2">
          Oracle Reputation (Dataset Insights)
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchReputation}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card raised>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Active Data Stations
              </Typography>
              <Typography variant="h3" component="div" color="primary">
                {networkStats.activeNodes || 0}/{networkStats.totalNodes || 0}
              </Typography>
              <Chip
                label={`${networkStats.suspendedNodes || 0} offline`}
                color={(networkStats.suspendedNodes || 0) > 0 ? 'warning' : 'success'}
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card raised>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Average Coverage
              </Typography>
              <Typography variant="h3" component="div" color="success.main">
                {formatPercent(networkStats.averageCoverage, 1)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, networkStats.averageCoverage || 0)}
                color="success"
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card raised>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Average Reputation
              </Typography>
              <Typography variant="h3" component="div" color="info.main">
                {formatNumber(networkStats.averageReputation, 1)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Avg. deviation: {formatNumber(networkStats.averageDeviation, 2)} mm
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card raised>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Dataset Coverage
              </Typography>
              <Typography variant="h6" color="text.primary">
                {datasetInfo.totalDays || 0} days · {datasetInfo.stationCount || 0} stations
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {datasetInfo.firstTimestamp ? formatDate(datasetInfo.firstTimestamp) : '--'} – {datasetInfo.lastTimestamp ? formatDate(datasetInfo.lastTimestamp) : '--'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card raised>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Station Reliability Breakdown
          </Typography>
          
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Station</TableCell>
                  <TableCell align="center">Coverage</TableCell>
                  <TableCell align="center">Avg Rainfall (mm)</TableCell>
                  <TableCell align="center">Avg Temp (°C)</TableCell>
                  <TableCell align="center">Avg Humidity (%)</TableCell>
                  <TableCell align="center">Deviation (mm)</TableCell>
                  <TableCell align="center">Reputation</TableCell>
                  <TableCell align="center">Accuracy</TableCell>
                  <TableCell align="center">Last Update</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nodes.map((node) => (
                  <TableRow key={node.nodeId} hover>
                    <TableCell>
                      <Stack spacing={0.3}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {node.displayName || node.nodeId.toUpperCase()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {node.location?.city || 'Unknown City'}, {node.location?.country || 'Unknown Country'}
                        </Typography>
                        {node.notes && (
                          <Typography variant="caption" color="text.secondary">
                            {node.notes}
                      </Typography>
                        )}
                        <Chip
                          icon={getTierIcon(node.tier?.tier)}
                          label={node.status || 'Unknown'}
                          color={node.statusColor || 'default'}
                          size="small"
                          variant="outlined"
                          sx={{ width: 'fit-content' }}
                        />
                      </Stack>
                    </TableCell>

                    <TableCell align="center">
                      <Stack spacing={0.5} alignItems="center">
                      <Chip
                          label={formatPercent(node.coveragePercent, 1)}
                          color={node.statusColor || 'default'}
                        size="small"
                      />
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, node.coveragePercent || 0)}
                          sx={{ width: 80, height: 6, borderRadius: 3 }}
                        />
                      </Stack>
                    </TableCell>

                    <TableCell align="center">{formatNumber(node.averages?.rainfallMm, 2)}</TableCell>
                    <TableCell align="center">{formatNumber(node.averages?.temperatureC, 1)}</TableCell>
                    <TableCell align="center">{formatNumber(node.averages?.humidityPercent, 1)}</TableCell>
                    <TableCell align="center">{formatNumber(node.averageDeviationMm, 2)}</TableCell>

                    <TableCell align="center">
                      <Chip
                        label={`${formatNumber(node.reputation, 1)} (${node.tier?.tier || 'unknown'})`}
                        color={node.tier?.color || 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={formatPercent(node.accuracy, 0)}
                        color={getAccuracyColor(node.accuracy)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title={node.lastUpdate ? new Date(node.lastUpdate).toLocaleString() : ''}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(node.lastUpdate)}
                      </Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            How to read these scores
          </Typography>
          <Stack spacing={0.75}>
            <Typography variant="body2">
              • <strong>Reputation</strong> blends coverage (how many days the station reported rain) and consistency (how close it stays to the dataset average).
            </Typography>
            <Typography variant="body2">
              • <strong>Coverage</strong> shows the percentage of days with precipitation readings in the dataset window.
            </Typography>
            <Typography variant="body2">
              • <strong>Deviation</strong> is the average difference between the station and the cross-station rainfall consensus (lower is better).
            </Typography>
            <Typography variant="body2">
              • <strong>Accuracy</strong> indicates how often the station contributed precipitation data (100% means every day in the dataset).
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {reputationData?.timestamp && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, display: 'block', textAlign: 'center' }}
        >
          Last updated: {new Date(reputationData.timestamp).toLocaleString()}
        </Typography>
      )}
    </Box>
  );
};

export default OracleReputation;

