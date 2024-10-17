// src/App.js

import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import { AuthContext } from './contexts/AuthContext';
import Web3 from 'web3';
import ChemicalTrackerABI from './ChemicalTrackerABI.json';
import Instructions from './Instructions'; // Importing the Instructions component
import { motion, AnimatePresence } from 'framer-motion'; // For transitions and animations

const ChemicalTrackerAddress = '0xCFc9917aeFa082CcA081C37bF08eba0131eEF9a9';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useState(null);
  const [chemicalName, setChemicalName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [batchID, setBatchID] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [batchData, setBatchData] = useState(null);
  const { user, login: authLogin, logout } = useContext(AuthContext);

  const [contractInstance, setContractInstance] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const [showInstructions, setShowInstructions] = useState(false); // State to toggle instructions

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);

          const contract = new web3.eth.Contract(ChemicalTrackerABI.abi, ChemicalTrackerAddress);
          setContractInstance(contract);

          const userAccounts = await web3.eth.getAccounts();
          setAccounts(userAccounts);

          window.ethereum.on('accountsChanged', (accounts) => setAccounts(accounts));
          window.ethereum.on('chainChanged', () => window.location.reload());
        } catch (error) {
          console.error('Error initializing Web3 or accessing accounts:', error);
        }
      } else {
        alert('Please install MetaMask to use this app.');
      }
    };

    initWeb3();
  }, []);

  const handleLogin = async () => {
    try {
      await authLogin(username, password);
      setIsLoggedIn(true);
      setError('');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to retrieve location');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const createBatch = async () => {
    if (!contractInstance) {
      alert('Contract not initialized.');
      return;
    }
    if (!chemicalName || !locationName) {
      alert('Please enter all fields.');
      return;
    }

    try {
      setIsLoading(true);
      await contractInstance.methods.createBatch(chemicalName, locationName).send({ from: accounts[0] });
      setIsLoading(false);
      alert('Batch created successfully!');
    } catch (error) {
      console.error('Error creating batch:', error);
      setIsLoading(false);
    }
  };

  const transferBatch = async () => {
    if (!contractInstance) {
      alert('Contract not initialized.');
      return;
    }
    if (!batchID || !newOwner || !newLocation) {
      alert('Please enter all fields.');
      return;
    }

    try {
      setIsLoading(true);
      await contractInstance.methods.transferBatch(batchID, newOwner, newLocation).send({
        from: accounts[0],
        gas: 300000,
        gasPrice: Web3.utils.toWei('20', 'gwei'),
      });
      setIsLoading(false);
      alert('Batch transferred successfully!');
    } catch (error) {
      console.error('Error transferring batch:', error);
      setIsLoading(false);
    }
  };

  const completeBatch = async () => {
    if (!contractInstance) {
      alert('Contract not initialized.');
      return;
    }
    if (!batchID) {
      alert('Please enter Batch ID.');
      return;
    }

    try {
      setIsLoading(true);
      await contractInstance.methods.completeBatch(batchID).send({ from: accounts[0] });
      setIsLoading(false);
      alert('Batch completed successfully!');
    } catch (error) {
      console.error('Error completing batch:', error);
      setIsLoading(false);
    }
  };

  const getBatchData = async () => {
    if (!contractInstance) {
      alert('Contract not initialized.');
      return;
    }
    try {
      const data = await contractInstance.methods.batches(batchID).call();
      setBatchData(data);
    } catch (error) {
      console.error('Error fetching batch data:', error);
    }
  };

  const viewBatchDetails = () => {
    alert('Viewing batch details is not implemented yet.');
  };

  const renderDashboard = () => {
    if (!user) return null;

    const dashboardVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

    switch (user.role) {
      case 'admin':
        return (
          <motion.div variants={dashboardVariants} initial="hidden" animate="visible" className="dashboard-layout">
            <h1>Admin Dashboard</h1>
            <p>Admin can manage the system and oversee operations.</p>
            <button className="action-button" onClick={handleGetLocation}>Get Current Location</button>
            {location && (
              <div>
                <p><strong>Latitude:</strong> {location.latitude}</p>
                <p><strong>Longitude:</strong> {location.longitude}</p>
              </div>
            )}
            <div className="batch-creation">
              <h2>Create Batch</h2>
              <input
                type="text"
                className="input-field"
                placeholder="Chemical Name"
                value={chemicalName}
                onChange={e => setChemicalName(e.target.value)}
              />
              <input
                type="text"
                className="input-field"
                placeholder="Location"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
              />
              <button className="action-button" onClick={createBatch} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Batch'}
              </button>
            </div>
            <div className="batch-transfer">
              <h2>Transfer Batch</h2>
              <input
                type="text"
                className="input-field"
                placeholder="Batch ID"
                value={batchID}
                onChange={e => setBatchID(e.target.value)}
              />
              <input
                type="text"
                className="input-field"
                placeholder="New Owner"
                value={newOwner}
                onChange={e => setNewOwner(e.target.value)}
              />
              <input
                type="text"
                className="input-field"
                placeholder="New Location"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
              />
              <button className="action-button" onClick={transferBatch} disabled={isLoading}>
                {isLoading ? 'Transferring...' : 'Transfer Batch'}
              </button>
            </div>
            <div className="batch-completion">
              <h2>Complete Batch</h2>
              <input
                type="text"
                className="input-field"
                placeholder="Batch ID"
                value={batchID}
                onChange={e => setBatchID(e.target.value)}
              />
              <button className="action-button" onClick={completeBatch} disabled={isLoading}>
                {isLoading ? 'Completing...' : 'Complete Batch'}
              </button>
            </div>
            <div className="batch-viewing">
              <h2>View Batch Data</h2>
              <input
                type="text"
                className="input-field"
                placeholder="Batch ID"
                value={batchID}
                onChange={e => setBatchID(e.target.value)}
              />
              <button className="action-button" onClick={getBatchData} disabled={isLoading}>
                {isLoading ? 'Fetching...' : 'Get Batch Data'}
              </button>
              {batchData && (
                <div>
                  <h3>Batch Data:</h3>
                  <pre>{JSON.stringify(batchData, null, 2)}</pre>
                </div>
              )}
            </div>
            <div className="logout-container">
              <button className="logout-button" onClick={logout}>Logout</button>
            </div>
          </motion.div>
        );
      case 'manufacturer':
        return (
          <motion.div variants={dashboardVariants} initial="hidden" animate="visible" className="dashboard-layout">
            <h1>Manufacturer Dashboard</h1>
            <p>Manufacturer can create and manage their batches.</p>
            <button className="action-button" onClick={handleGetLocation}>Get Current Location</button>
            {location && (
              <div>
                <p><strong>Latitude:</strong> {location.latitude}</p>
                <p><strong>Longitude:</strong> {location.longitude}</p>
              </div>
            )}
            <div className="batch-creation">
              <h2>Create Batch</h2>
              <input
                type="text"
                className="input-field"
                placeholder="Chemical Name"
                value={chemicalName}
                onChange={e => setChemicalName(e.target.value)}
              />
              <input
                type="text"
                className="input-field"
                placeholder="Location"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
              />
              <button className="action-button" onClick={createBatch} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Batch'}
              </button>
            </div>
          </motion.div>
        );
      case 'buyer':
        return (
          <motion.div variants={dashboardVariants} initial="hidden" animate="visible" className="dashboard-layout">
            <h1>Buyer Dashboard</h1>
            <p>Buyer can view and track the chemicals.</p>
            <button className="action-button" onClick={viewBatchDetails}>View Batch Details</button>
          </motion.div>
        );
      default:
        return (
          <motion.div variants={dashboardVariants} initial="hidden" animate="visible" className="dashboard-layout">
            <h1>Welcome</h1>
            <p>Please log in to access the dashboard.</p>
          </motion.div>
        );
    }
  };

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait"> {/* Changed from exitBeforeEnter */}
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="login-container" // Added class for styling
          >
            <h2>Login</h2>
            <input
              type="text"
              className="input-field"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="action-button" onClick={handleLogin}>Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <div className="logout-container">
              <button className="logout-button" onClick={logout}>Logout</button>
            </div>
            {renderDashboard()}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="App">
      <h1 className="title">Blockchain Tracking App</h1>
      <div className="nav-buttons">
        <button className="nav-button" onClick={() => setShowInstructions(false)}>Home</button>
        <button className="nav-button" onClick={() => setShowInstructions(true)}>Instructions</button>
      </div>
      {showInstructions ? <Instructions /> : renderContent()}
    </div>
  );
};

export default App;
