import {
  generate24WordMnemonic,
  generateAccountsFromMnemonic,
  generateEd25519PrivateKey,
  generateNewVirtualAccount,
} from "./account-utils";

let defaultNetworkId = 0; // 0 for stokenet, 1 for mainnet

export async function create_random_accounts(
  networkId: number = defaultNetworkId
) {
  console.log("DEMO: Creating accounts from a mnemonic phrase.");
  // mnemonic phrase must be words separated by spaces
  let mnemonic = ""; // manually add mnemonic phrase here
  if (mnemonic == "") {
    mnemonic = generate24WordMnemonic(); // generate new random mnemonic phrase if none specified
  }
  console.log("Phrase: ", mnemonic);

  let multiAccounts = generateAccountsFromMnemonic(
    mnemonic,
    [0, 1, 2, 100],
    networkId
  );
  (await multiAccounts).forEach((accountData) => {
    console.log(
      "Index: " +
        accountData.accountIndex +
        "      Address : " +
        accountData.accountAddress
    );
    console.log(
      "Private Key Bytes: [" + accountData.privateKey.bytes.join() + "]"
    );
  });
}

export async function load_account_from_pkBytes(
  networkId: number = defaultNetworkId
) {
  console.log("DEMO: Create an account from an array of bytes.");
  let pkBytes: Uint8Array = Uint8Array.from([
    59, 221, 206, 186, 244, 250, 32, 61, 48, 35, 211, 187, 215, 144, 255, 221,
    195, 4, 159, 158, 149, 222, 251, 113, 141, 82, 164, 202, 44, 150, 174, 79,
  ]); // you can load this array from a .env file or get it from any other source
  console.log("Bytes array: [" + pkBytes.join() + "]");
  let privateKey = await generateEd25519PrivateKey(pkBytes);
  let account = await generateNewVirtualAccount(privateKey, networkId);
  console.log("New account created from bytes: " + account.address);
}
