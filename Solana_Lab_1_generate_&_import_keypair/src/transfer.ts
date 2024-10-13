import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import solConnection from "./connection";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { getBalance } from "./getBalance";

const suppliedToPubkey = process.argv[2] || null;
const amount = process.argv[3] || null;

if (!suppliedToPubkey || !amount) {
  console.log(`Please provide a public key and amount to send to`);
  process.exit(1);
}

const solTransfer = async () => {
  try {
    const connection = await solConnection();
    if (!connection) {
      console.log("Connection is not yet established");
      process.exit(1);
    }

    const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");
    const balance = await getBalance();
    console.log(
      "Sender public key:",
      senderKeypair.publicKey.toBase58(),
      "Balance:",
      balance,
      "SOL"
    );
    console.log(`Recipient public key: ${suppliedToPubkey}`);

    const toPubkey = new PublicKey(suppliedToPubkey);

    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();

    const minimumBalanceForRentExemption =
      await connection.getMinimumBalanceForRentExemption(0);
    console.log(
      `Minimum balance for rent exemption: ${
        minimumBalanceForRentExemption / LAMPORTS_PER_SOL
      } SOL`
    );
    const lamportToSend = Math.max(
      Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL),
      minimumBalanceForRentExemption
    );
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey,
        lamports: lamportToSend,
      })
    );

    // Set the blockhash and sign the transaction
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderKeypair.publicKey;

    // Estimate fee
    const fees = await transaction.getEstimatedFee(connection);
    if (fees)
      console.log(`Estimated transaction fee: ${fees / LAMPORTS_PER_SOL} SOL`);

    // Send and confirm the transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      senderKeypair,
    ]);

    console.log(
      `💸 Finished! Sent ${lamportToSend} SOL to the address ${toPubkey.toBase58()}.`
    );
    console.log(`Transaction signature: ${signature}`);
  } catch (error) {
    console.error("Error during transaction:", error);
  }
};

solTransfer().catch(console.error);
