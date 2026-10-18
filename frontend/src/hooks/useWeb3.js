import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);

  const fetchBalance = useCallback(async (userAccount, browserProvider) => {
    if (!userAccount || !browserProvider) return;
    try {
      const bal = await browserProvider.getBalance(userAccount);
      const ethBal = Number(ethers.formatEther(bal));
      setBalance(ethBal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }));
    } catch (err) {
      console.warn('Failed to fetch account balance:', err.message || err);
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install the MetaMask browser extension to continue.');
      return;
    }

    setLoading(true);
    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts && accounts.length > 0) {
        const activeAccount = accounts[0];
        setAccount(activeAccount);
        setIsConnected(true);
        setProvider(browserProvider);

        // Fetch network details
        try {
          const network = await browserProvider.getNetwork();
          setChainId(Number(network.chainId));
        } catch (e) {
          console.warn('Network query warning:', e);
        }

        // Fetch live balance
        await fetchBalance(activeAccount, browserProvider);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet: ' + (error.message || 'User rejected request'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);

      window.ethereum.request({ method: 'eth_accounts' })
        .then(async (accounts) => {
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            setProvider(browserProvider);
            try {
              const network = await browserProvider.getNetwork();
              setChainId(Number(network.chainId));
            } catch (e) {}
            await fetchBalance(accounts[0], browserProvider);
          }
        })
        .catch(console.warn);

      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          await fetchBalance(accounts[0], browserProvider);
        } else {
          setAccount(null);
          setIsConnected(false);
          setBalance('0');
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [fetchBalance]);

  // Periodic balance refresher when connected
  useEffect(() => {
    if (!account || !provider) return;
    const interval = setInterval(() => {
      fetchBalance(account, provider);
    }, 10000);
    return () => clearInterval(interval);
  }, [account, provider, fetchBalance]);

  return {
    account,
    balance,
    isConnected,
    loading,
    connectWallet,
    provider,
    chainId,
    refreshBalance: () => fetchBalance(account, provider)
  };
};

export default useWeb3;