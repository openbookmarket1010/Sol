import { Connection, PublicKey, Transaction, sendAndConfirmTransaction, SystemProgram } from '@solana/web3.js';

// Set the network cluster endpoint
const network = 'https://api.devnet.solana.com'; // You can change this to other networks like mainnet-beta, testnet, etc.

// Create a new connection to the network
const connection = new Connection(network, 'confirmed');

// Initialize Phantom wallet
const phantom = window.solana;

// Connect to Phantom wallet
async function connectToWallet() {
    if (!phantom) {
        alert('Phantom wallet not detected. Please install Phantom wallet.');
        return;
    }

    if (!phantom.isPhantom) {
        alert('Phantom is not enabled. Please enable Phantom wallet.');
        return;
    }

    try {
        await phantom.connect();
        const publicKey = await phantom.publicKey();
        console.log('Connected to Phantom with public key:', publicKey.toBase58());
        return publicKey;
    } catch (error) {
        console.error('Error connecting to Phantom:', error);
        return null;
    }
}

// Function to send a Solana transaction
async function sendSolanaTransaction(fromPublicKey: PublicKey, toPublicKey: PublicKey, amount: number) {
    try {
        // Create transaction
        const transaction = new Transaction().add(
            // Example: Transfer 0.001 SOL to the recipient
            SystemProgram.transfer({
                fromPubkey: fromPublicKey,
                toPubkey: toPublicKey,
                lamports: amount * 1000000000, // Convert SOL to lamports
            })
        );

        // Sign transaction
        const signedTransaction = await phantom.signTransaction(transaction);

        // Send transaction
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        await connection.confirmTransaction(signature);
        console.log('Transaction confirmed:', signature);
    } catch (error) {
        console.error('Error sending Solana transaction:', error);
    }
}

// Example usage
async function main() {
    const senderPublicKey = await connectToWallet(); // Connect to Phantom wallet
    const recipientPublicKey = new PublicKey('recipient_public_key_here'); // Replace with recipient's public key
    const amountToSend = 0.001; // Replace with amount to send in SOL
    if (senderPublicKey) {
        await sendSolanaTransaction(senderPublicKey, recipientPublicKey, amountToSend);
    } else {
        console.log('Failed to connect to Phantom wallet.');
    }
}

main();
