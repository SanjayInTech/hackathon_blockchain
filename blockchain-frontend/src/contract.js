import web3 from './web3';
import ChemicalTrackerABI from './ChemicalTrackerABI.json';

const contractAddress = '0xCFc9917aeFa082CcA081C37bF08eba0131eEF9a9'; 
const contract = new web3.eth.Contract(ChemicalTrackerABI, contractAddress);

export default contract;
