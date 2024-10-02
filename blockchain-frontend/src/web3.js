import Web3 from 'web3';

let web3;
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  window.ethereum.enable();
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545")); 
}

export default web3;
