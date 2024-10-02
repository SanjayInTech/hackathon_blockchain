const Web3 = require('web3');
const { abi, evm } = require('./src/ChemicalTrackerABI.json'); // Adjust path to your ABI and bytecode

const web3 = new Web3('http://localhost:7545'); // or another RPC URL

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' });
  
  console.log('Contract deployed to', result.options.address);
};

deploy();
