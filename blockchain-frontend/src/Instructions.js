// src/Instructions.js

import React, { useState } from 'react';
import './Instructions.css'; // Importing the CSS file for styles
import { motion, AnimatePresence } from 'framer-motion'; // Importing framer-motion for animations
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'; // Importing icons

const Instructions = () => {
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  const toggleSection = (setter) => setter((prevState) => !prevState);

  const sectionVariants = {
    hidden: { height: 0, opacity: 0, overflow: 'hidden' },
    visible: { height: 'auto', opacity: 1, overflow: 'visible' },
    transition: { duration: 0.5, ease: 'easeInOut' },
  };

  return (
    <div className="instructions-container">
      <h1>Blockchain Tracking Instructions</h1>

      <h2>Technologies Used:</h2>
      <ul>
        <li>Solidity (Ethereum Blockchain)</li>
        <li>React.js (Frontend User Interface)</li>
        <li>Ganache (Local Blockchain for Ethereum Development)</li>
        <li>MetaMask (Ethereum Wallet Extension)</li>
      </ul>

      {/* Toggle section for "Getting Started" with Framer Motion */}
      <h2 onClick={() => toggleSection(setShowGettingStarted)} className="toggle-section">
        {showGettingStarted ? <FaChevronDown /> : <FaChevronRight />} Getting Started
      </h2>
      <AnimatePresence>
        {showGettingStarted && (
          <motion.div
            key="gettingStarted"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sectionVariants}
          >
            <p>Follow these steps to install, configure, and run the project locally.</p>
            <h3>Prerequisites</h3>
            <p>Ensure you have the following software installed:</p>
            <ul>
              <li><a href="https://trufflesuite.com/ganache/" target="_blank" rel="noreferrer">Ganache</a> – Local Ethereum blockchain environment</li>
              <li><a href="https://metamask.io/" target="_blank" rel="noreferrer">MetaMask</a> – Chrome extension for Ethereum wallet</li>
              <li><a href="https://nodejs.org/en/" target="_blank" rel="noreferrer">Node.js</a> – Required for the React frontend</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle section for "Installation and Setup" */}
      <h2 onClick={() => toggleSection(setShowSetup)} className="toggle-section">
        {showSetup ? <FaChevronDown /> : <FaChevronRight />} Installation and Setup
      </h2>
      <AnimatePresence>
        {showSetup && (
          <motion.div
            key="setup"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sectionVariants}
          >
            <h3>Install Ganache</h3>
            <p>Download and install <a href="https://trufflesuite.com/ganache/" target="_blank" rel="noreferrer">Ganache</a>.</p>
            
            <h3>Install MetaMask</h3>
            <p>Add the MetaMask extension to your browser from the <a href="https://chrome.google.com/webstore/detail/metamask" target="_blank" rel="noreferrer">Chrome Web Store</a>.</p>

            <h3>Connect MetaMask to Ganache</h3>
            <ol>
              <li>Open MetaMask and click "Networks" to add a custom RPC network.</li>
              <li>Copy the RPC URL from Ganache (e.g., <code>http://127.0.0.1:7545</code>) and paste it into MetaMask.</li>
              <li>Import an account from Ganache into MetaMask using the private key.</li>
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle section for "Deploying the Smart Contract" */}
      <h2 onClick={() => toggleSection(setShowDeploy)} className="toggle-section">
        {showDeploy ? <FaChevronDown /> : <FaChevronRight />} Deploying the Smart Contract
      </h2>
      <AnimatePresence>
        {showDeploy && (
          <motion.div
            key="deploy"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sectionVariants}
          >
            <h3>Compile and Migrate the Smart Contract</h3>
            <p>
              Navigate to your project folder and run the following commands:
            </p>
            <pre>
              <code>
                truffle compile<br />
                truffle migrate
              </code>
            </pre>
            <p>Once deployed, the ABI and contract address will be generated.</p>

            <h3>Update `contract.js`</h3>
            <p>Copy the generated ABI and contract address, then update the `contract.js` file accordingly.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle section for "Troubleshooting" */}
      <h2 onClick={() => toggleSection(setShowTroubleshooting)} className="toggle-section">
        {showTroubleshooting ? <FaChevronDown /> : <FaChevronRight />} Troubleshooting
      </h2>
      <AnimatePresence>
        {showTroubleshooting && (
          <motion.div
            key="troubleshooting"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sectionVariants}
          >
            <h3>Common Issues</h3>
            <ul>
              <li>Ensure Ganache is running and connected to MetaMask.</li>
              <li>Check that the correct network is selected in MetaMask.</li>
              <li>Ensure the ABI and contract addresses are correctly updated in `contract.js`.</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Instructions;
