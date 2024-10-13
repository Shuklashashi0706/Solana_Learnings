import solConnection from "./connection";
import importKeyPair from "./importKeyPair";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
export const getBalance = async () => {
  try {
    const connection = await solConnection();
    if (!connection) {
      throw new Error("Connection to Solana network failed.");
    }
    const keypair = await importKeyPair();
    if (!keypair) {
      return;
    }
    const address = new PublicKey(keypair.publicKey);
    const balance: any = await connection.getBalance(address);
    const balanceInSol = balance / LAMPORTS_PER_SOL;
    return balanceInSol;
  } catch (error) {
    console.error(error);
  }
};
