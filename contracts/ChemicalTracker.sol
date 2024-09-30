pragma solidity ^0.8.0;

contract ChemicalTracker {
    struct ChemicalBatch {
        uint batchID;
        string chemicalName;
        address manufacturer; // Change type from string to address
        address currentOwner;
        string location;
        bool completed;
    }

    uint public nextBatchID = 1;
    mapping(uint => ChemicalBatch) public batches;

    event BatchCreated(uint batchID, string chemicalName, address indexed owner);
    event BatchTransferred(uint batchID, address indexed from, address indexed to, string newLocation);
    event BatchCompleted(uint batchID);

    function createBatch(string memory chemicalName, string memory location) public {
        batches[nextBatchID] = ChemicalBatch({
            batchID: nextBatchID,
            chemicalName: chemicalName,
            manufacturer: msg.sender, // No need for conversion
            currentOwner: msg.sender,
            location: location,
            completed: false
        });
        emit BatchCreated(nextBatchID, chemicalName, msg.sender);
        nextBatchID++;
    }

    function transferBatch(uint batchID, address newOwner, string memory newLocation) public {
        require(msg.sender == batches[batchID].currentOwner, "Only the current owner can transfer the batch");
        batches[batchID].currentOwner = newOwner;
        batches[batchID].location = newLocation;
        emit BatchTransferred(batchID, msg.sender, newOwner, newLocation);
    }

    function completeBatch(uint batchID) public {
        require(msg.sender == batches[batchID].currentOwner, "Only the current owner can complete the batch");
        batches[batchID].completed = true;
        emit BatchCompleted(batchID);
    }
}

