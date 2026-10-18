import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useWeb3 } from './hooks/useWeb3.js';
import './index.css';

import Dashboard from './components/Dashboard.js';
import CreatePolicy from './components/CreatePolicy.js';
import MyPolicies from './components/MyPolicies.js';
import WeatherFeed from './components/WeatherFeed.js';
import OracleReputation from './components/OracleReputation.js';
import CropRecommendation from './components/CropRecommendation.js';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#10B981', // Emerald 500
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#06B6D4', // Cyan 500
      light: '#22D3EE',
      dark: '#0891B2',
    },
    background: {
      default: '#0B0F19',
      paper: '#111827',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#9CA3AF',
    },
    divider: '#1F2937',
    action: {
      hover: 'rgba(16, 185, 129, 0.08)',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#111827',
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)',
          border: '1px solid #1F2937',
          borderRadius: 12,
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: '#10B981',
          '&:hover': {
            backgroundColor: '#059669',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#111827',
          border: '1px solid #1F2937',
        },
      },
    },
  },
});

function NavigationBar() {
  const { account, balance, isConnected, connectWallet, loading, chainId } = useWeb3();

  return (
    <header className="cropcover-header">
      <div className="cropcover-header-top">
        <div className="cropcover-brand">
          <div className="brand-logo-mark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M12 8v8"/>
              <path d="M8 12h8"/>
            </svg>
          </div>
          <div>
            <h1 className="brand-title">CropCover</h1>
            <p className="brand-subtitle">Autonomous Parametric Weather Insurance Protocol</p>
          </div>
        </div>

        <div className="cropcover-wallet-area">
          {isConnected ? (
            <div className="wallet-connected-pill">
              <div className="network-status-indicator" title={chainId ? `Chain ID: ${chainId}` : 'Connected'}>
                <span className="pulsing-green-dot"></span>
                <span className="network-label">Localhost {chainId ? `(${chainId})` : '8545'}</span>
              </div>
              <div className="balance-badge">
                <span className="balance-num">{balance}</span>
                <span className="balance-unit">ETH</span>
              </div>
              <div className="account-badge" title={account}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
                <span>{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''}</span>
              </div>
            </div>
          ) : (
            <button className="connect-wallet-btn" onClick={connectWallet} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                <path d="M16 11.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z"/>
                <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/>
              </svg>
              <span>{loading ? 'Connecting...' : 'Connect MetaMask'}</span>
            </button>
          )}
        </div>
      </div>

      <nav className="cropcover-navbar">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-tab active' : 'nav-tab')} end>
          Dashboard
        </NavLink>
        <NavLink to="/create-policy" className={({ isActive }) => (isActive ? 'nav-tab active' : 'nav-tab')}>
          Create Policy
        </NavLink>
        <NavLink to="/my-policies" className={({ isActive }) => (isActive ? 'nav-tab active' : 'nav-tab')}>
          My Policies
        </NavLink>
        <NavLink to="/weather" className={({ isActive }) => (isActive ? 'nav-tab active' : 'nav-tab')}>
          Weather Feed
        </NavLink>
        <NavLink to="/oracle" className={({ isActive }) => (isActive ? 'nav-tab active' : 'nav-tab')}>
          Oracle Reputation
        </NavLink>
        <NavLink to="/crop-recommendation" className={({ isActive }) => (isActive ? 'nav-tab active' : 'nav-tab')}>
          Crop AI Model
        </NavLink>
      </nav>
    </header>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <div className="cropcover-root">
          <NavigationBar />
          
          <main className="cropcover-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create-policy" element={<CreatePolicy />} />
              <Route path="/my-policies" element={<MyPolicies />} />
              <Route path="/weather" element={<WeatherFeed />} />
              <Route path="/oracle" element={<OracleReputation />} />
              <Route path="/crop-recommendation" element={<CropRecommendation />} />
            </Routes>
          </main>

          <footer className="cropcover-footer">
            <div className="footer-content">
              <span>CropCover Protocol · Decentralized Weather Risk Mitigation</span>
              <span className="footer-meta">Solidity · Hardhat · Web3 · Author: Aum Mangal</span>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;