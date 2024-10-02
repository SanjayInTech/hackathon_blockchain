import React, { useState, useEffect, createContext, useContext } from 'react';
import Web3 from 'web3';
import contractABI from './ChemicalTrackerABI.json'; 
import './App.css';

// AuthContext for managing authentication state
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const App = () => {
  const [chemicalName, setChemicalName] = useState('');
  const [location, setLocation] = useState('');
  const [batchID, setBatchID] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contractInstance, setContractInstance] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [batchData, setBatchData] = useState(null);

  const context = useContext(AuthContext); 
  const { user, login, logout } = context || {}; 

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);

          const contractAddress = '0xb48B413bBBb7D557B042Ea0DEb8528C25c70Ad57'; 
          const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
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

  const createBatch = async () => {
    if (!contractInstance) {
      alert('Contract not initialized.');
      return;
    }
    if (!chemicalName || !location) {
      alert('Please enter all fields.');
      return;
    }

    try {
      setIsLoading(true);
      await contractInstance.methods.createBatch(chemicalName, location).send({ from: accounts[0] });
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
      await contractInstance.methods.transferBatch(batchID, newOwner, newLocation).send({ from: accounts[0] });
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

  return (
    <div className="app-container">
      <h1>Chemical Tracking System</h1>

      {isLoading && <p>Loading...</p>}

      <div className="form-section">
        <h3>Create New Batch</h3>
        <input
          value={chemicalName}
          onChange={e => setChemicalName(e.target.value)}
          placeholder="Chemical Name"
        />
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Location"
        />
        <button onClick={createBatch} disabled={isLoading}>Create Batch</button>
      </div>

      <div className="form-section">
        <h3>Transfer Batch</h3>
        <input
          value={batchID}
          onChange={e => setBatchID(e.target.value)}
          placeholder="Batch ID"
        />
        <input
          value={newOwner}
          onChange={e => setNewOwner(e.target.value)}
          placeholder="New Owner"
        />
        <input
          value={newLocation}
          onChange={e => setNewLocation(e.target.value)}
          placeholder="New Location"
        />
        <button onClick={transferBatch} disabled={isLoading}>Transfer Batch</button>
      </div>

      <div className="form-section">
        <h3>Complete Batch</h3>
        <input
          value={batchID}
          onChange={e => setBatchID(e.target.value)}
          placeholder="Batch ID"
        />
        <button onClick={completeBatch} disabled={isLoading}>Complete Batch</button>
      </div>

      <div className="form-section">
        <h3>View Batch Data</h3>
        <input
          value={batchID}
          onChange={e => setBatchID(e.target.value)}
          placeholder="Batch ID"
        />
        <button onClick={getBatchData} disabled={isLoading}>Get Batch Data</button>

        {batchData && (
          <div>
            <p><strong>Batch ID:</strong> {batchData.batchID}</p>
            <p><strong>Chemical Name:</strong> {batchData.chemicalName}</p>
            <p><strong>Manufacturer:</strong> {batchData.manufacturer}</p>
            <p><strong>Current Owner:</strong> {batchData.currentOwner}</p>
            <p><strong>Location:</strong> {batchData.location}</p>
            <p><strong>Completed:</strong> {batchData.completed ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
