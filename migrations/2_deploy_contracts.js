const ChemicalTracker = artifacts.require("ChemicalTracker");

module.exports = function (deployer) {
  deployer.deploy(ChemicalTracker);
};
