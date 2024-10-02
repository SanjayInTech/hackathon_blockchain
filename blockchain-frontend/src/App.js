import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import { AuthContext } from './contexts/AuthContext'; 
import Web3 from 'web3';
import ChemicalTrackerABI from './ChemicalTrackerABI.json';

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
      setError(err.message);
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
      console.error('Contract instance is not set.');
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
      await contractInstance.methods.transferBatch(batchID, newOwner, newLocation).send({ from: accounts[0],gas: 300000,
        gasPrice: Web3.utils.toWei('20', 'gwei'), });
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

    switch (user.role) {
      case 'admin':
        return (
          <div>
            <h1>Admin Dashboard</h1>
            <p>Admin can manage everything.</p>
            <button onClick={handleGetLocation}>Get Current Location</button>
            {location && (
              <div>
                <p><strong>Latitude:</strong> {location.latitude}</p>
                <p><strong>Longitude:</strong> {location.longitude}</p>
              </div>
            )}
            <div>
              <h2>Create Batch</h2>
              <input
                type="text"
                placeholder="Chemical Name"
                value={chemicalName}
                onChange={e => setChemicalName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
              />
              <button onClick={createBatch} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Batch'}
              </button>
              <h2>Transfer Batch</h2>
              <input
                type="text"
                placeholder="Batch ID"
                value={batchID}
                onChange={e => setBatchID(e.target.value)}
              />
              <input
                type="text"
                placeholder="New Owner"
                value={newOwner}
                onChange={e => setNewOwner(e.target.value)}
              />
              <input
                type="text"
                placeholder="New Location"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
              />
              <button onClick={transferBatch} disabled={isLoading}>
                {isLoading ? 'Transferring...' : 'Transfer Batch'}
              </button>
              <h2>Complete Batch</h2>
              <input
                type="text"
                placeholder="Batch ID"
                value={batchID}
                onChange={e => setBatchID(e.target.value)}
              />
              <button onClick={completeBatch} disabled={isLoading}>
                {isLoading ? 'Completing...' : 'Complete Batch'}
              </button>
              <h2>View Batch Data</h2>
              <input
                type="text"
                placeholder="Batch ID"
                value={batchID}
                onChange={e => setBatchID(e.target.value)}
              />
              <button onClick={getBatchData} disabled={isLoading}>
                {isLoading ? 'Fetching...' : 'Get Batch Data'}
              </button>
              {batchData && (
                <div>
                  <h3>Batch Data:</h3>
                  <pre>{JSON.stringify(batchData, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        );
      case 'manufacturer':
        return (
          <div>
            <h1>Manufacturer Dashboard</h1>
            <p>Manufacturer can create and manage their batches.</p>
            <button onClick={handleGetLocation}>Get Current Location</button>
            {location && (
              <div>
                <p><strong>Latitude:</strong> {location.latitude}</p>
                <p><strong>Longitude:</strong> {location.longitude}</p>
              </div>
            )}
            <div>
              <h2>Create Batch</h2>
              <input
                type="text"
                placeholder="Chemical Name"
                value={chemicalName}
                onChange={e => setChemicalName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
              />
              <button onClick={createBatch} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Batch'}
              </button>
            </div>
          </div>
        );
      case 'buyer':
        return (
          <div>
            <h1>Buyer Dashboard</h1>
            <p>Buyer can view batch details.</p>
            <button onClick={viewBatchDetails}>View Batch Details</button>
          </div>
        );
      default:
        return (
          <div>
            <h1>Welcome</h1>
            <p>Please log in to access the dashboard.</p>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <h1>Blockchain Tracking App</h1>
      {!isLoggedIn ? (
        <div>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      ) : (
        <div>
          <button onClick={logout}>Logout</button>
          {renderDashboard()}
        </div>
      )}
    </div>
  );
};

export default App;