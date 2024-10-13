import {
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";

const solConnection = async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"));
    if (connection) {
      console.log("Connected successfully");
      return connection;
    }
  } catch (error) {
    console.log(error);
  }
};

export default solConnection;
