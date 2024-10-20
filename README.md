BlockChain Tracking 

Technologies Used:

Solidity (Ethereum Blockchain) React.js (Frontend User Interface) This project is a blockchain-based system designed to track chemicals from production to delivery, providing transparency and security. Below are the steps to set up, deploy, and test the project locally.

Getting Started Follow these steps to install, configure, and run the project.

Prerequisites Ensure you have the following software installed on your machine:

Ganache – Local blockchain for Ethereum development. MetaMask – Chrome extension for managing Ethereum accounts. Node.js – Required to run the React frontend.

Installation and Setup

Install Ganache:
Download and install Ganache. Start Ganache to set up your local Ethereum blockchain environment.

Install MetaMask Chrome Extension:
Add the MetaMask extension to your browser from the Chrome Web Store. MetaMask will serve as your Ethereum wallet for interacting with the local blockchain.

Connect MetaMask to Ganache:
Open MetaMask and click on "Networks" to add a new custom RPC network. In Ganache, copy the RPC Server URL (e.g., http://127.0.0.1:7545) and paste it into MetaMask's custom RPC settings. Import an account from Ganache into MetaMask using the private key from Ganache (click the key icon next to one of the accounts in Ganache). Deploying the Smart Contract

Compile and Migrate the Smart Contract:
Open the project folder in your IDE (e.g., VSCode). Copy the Ethereum address from Ganache into the App.js file (if necessary).

In your terminal, navigate to the project root and run: bash Copy code truffle compile truffle migrate The contract will be compiled, deployed, and an ABI (Application Binary Interface) key and contract address will be generated.

Update Contract.js:
After migration, copy the ABI key from the generated YourContract.json file in the /build/contracts/ folder. Update the Contract.js file with the ABI key and contract address. Running the Frontend

Start the React Application:
Navigate to the blockchain-tracking-frontend folder. Run the following command to start the development server: bash Copy code npm start This will open the application in your default browser. Using the Application

Login to the Portal:
Open the app in your browser at http://localhost:3000/. Use the following credentials to log in: Username: admin Password: admin

Create a Batch of Chemicals:
Once logged in, fill in the details of the chemical batch. Click the 'Create Batch' button to create a new batch. This action will trigger a blockchain transaction, recorded in Ganache.

Verify the Blockchain Transaction:
Open Ganache and check the blocks section to see a new block created for the transaction. This block confirms that the transaction is securely recorded on the blockchain. Role-Based Access Control The application supports multiple user roles, each with specific access rights:

Admin: Manages the system and oversees operations. Manufacturers: Can create chemical batches. Buyers: Can view and track the chemicals. Customers: Can view the chemical batches but with limited permissions. Troubleshooting

If you encounter any issues, ensure that: Ganache is running and connected to MetaMask. The correct network is selected in MetaMask. The ABI and contract addresses are properly updated in Contract.js. License This project is licensed under the MIT License - see the LICENSE file for details.
#   h a c k a t h o n _ b l o c k c h a i n  
 #   h a c k a t h o n _ b l o c k c h a i n  
 