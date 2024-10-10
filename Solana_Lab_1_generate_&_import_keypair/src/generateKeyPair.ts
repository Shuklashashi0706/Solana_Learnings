import { Keypair } from "@solana/web3.js";
import fs from "fs";
const keypair = Keypair.generate();

console.log("Public key:", keypair.publicKey.toBase58());
console.log("Private key:", keypair.secretKey);

// writes secret key in .env file
fs.writeFile(".env", `SECRET_KEY="[${keypair.secretKey}]"`, (error) => {
  if (error) {
    console.log("Error:", error);
    return;
  }
  console.log("Successful");
});
