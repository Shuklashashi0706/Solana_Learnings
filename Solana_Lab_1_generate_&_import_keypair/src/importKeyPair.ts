import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const importKeyPair = async () => {
  try {
    const keypair = getKeypairFromEnvironment("SECRET_KEY");
    if (!keypair) {
      console.error("Keypair is undefined.");
      return;
    }
    return keypair;
  } catch (error) {
    console.error("Error importing keypair:", error);
    throw error;
  }
};

export default importKeyPair;
