import {
  LTSRadixEngineToolkit,
  PrivateKey,
  PublicKey,
  RadixEngineToolkit,
} from "@radixdlt/radix-engine-toolkit";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { AccountData } from "../models/account-data";

export interface KeyPair {
  privateKey: PrivateKey;
  publicKey: PublicKey;
}

export interface AccountData {
  privateKey: PrivateKey;
  publicKey: PublicKey;
  address: string;
  vaults: Map<string, string[]>;
}

export interface AccountKeys extends KeyPair {
  accountAddress: string;
}

export interface AccountKeysAndIndex extends AccountKeys {
  accountIndex: number;
}

const KEY_TYPE = {
  TRANSACTION_SIGNING: 1460,
  AUTHENTICATION_SIGNING: 1678,
  MESSAGE_ENCRYPTION: 1391,
} as const;

const ENTITY_TYPE = {
  ACCOUNT: 525,
  IDENTITY: 618,
} as const;

// generates a 12 word mnemonic phrase
export function generate12WordMnemonic(): string {
  return bip39.generateMnemonic();
}

// generates a 24 word mnemonic phrase
export function generate24WordMnemonic(): string {
  return bip39.generateMnemonic(256);
}

// generates an account from a mnemonic phrase
export async function generateAccountFromMnemonic(
  mnemonic: string, // the mnemonic phrase as a string with words separated by spaces
  entityIndex: number = 0, // the entity index of the account (several private/public key pairs can be derived from the same mnemonic phrase) - the same mneominc and same index will always result in the same pair
  networkId: number = 1 // the Radix network id (stokenet = 0, mainnet = 1)
): Promise<AccountKeys> {
  let keyPair = generateKeyPair(
    mnemonic,
    entityIndex,
    networkId,
    ENTITY_TYPE.ACCOUNT
  );
  let accountAddress = await deriveAccountAddressFromPublicKey(
    keyPair.publicKey,
    networkId
  );
  return {
    accountAddress,
    ...keyPair,
  };
}

// generates an account from a private key expressed as an array of bytes
export async function generateAccountFromPrivateKeyBytes(
  privateKeyBytes: Uint8Array, // the array of bytes
  networkId: number // the Radix network id (stokenet = 0, mainnet = 1)
): Promise<AccountKeys> {
  const privateKey = new PrivateKey.Ed25519(privateKeyBytes);
  const publicKey = new PublicKey.Ed25519(privateKey.publicKeyHex());
  const accountAddress = await deriveAccountAddressFromPublicKey(
    publicKey,
    networkId
  );
  return {
    accountAddress,
    privateKey,
    publicKey,
  };
}

// generates several accounts form a mnemonic phrase based on the entity indices provided
export async function generateAccountsFromMnemonic(
  mnemonic: string, // the mnemonic phrase as a string with words separated by spaces
  indices: number[], // the entity indices to create account for
  networkId: number // the Radix network id (stokenet = 0, mainnet = 1)
): Promise<AccountKeysAndIndex[]> {
  let accounts: AccountKeysAndIndex[] = [];
  for (const index of indices) {
    let keyPair = generateKeyPair(
      mnemonic,
      index,
      networkId,
      ENTITY_TYPE.ACCOUNT
    );
    let accountAddress = await deriveAccountAddressFromPublicKey(
      keyPair.publicKey,
      networkId
    );
    accounts.push({
      accountIndex: index,
      accountAddress,
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
    });
  }
  return accounts;
}

// generates a Radix KeyPair for an account based on a mnemonic phrase and entity index
export function generateKeyPair(
  mnemonic: string, // the mnemonic phrase as a string with words separated by spaces
  entityIndex: number, // the entity index of the account (several private/public key pairs can be derived from the same mnemonic phrase) - the same mneominc and same index will always result in the same pair
  networkId: number, // the Radix network id (stokenet = 0, mainnet = 1)
  entityType: number // the code for the type of entity you want to create (account = 525, identity = 618)
): KeyPair {
  const derivationPath = `m/44'/1022'/${networkId}'/${entityType}'/${KEY_TYPE.TRANSACTION_SIGNING}'/${entityIndex}'`;
  const seedHex = mnemonicToSeed(mnemonic);
  const derivedKeyData = deriveKeyData(derivationPath, seedHex);
  const privateKey = new PrivateKey.Ed25519(derivedKeyData.key.toString("hex"));
  const publicKey = new PublicKey.Ed25519(privateKey.publicKeyHex());
  return {
    privateKey,
    publicKey,
  };
}

// derives an account address from a public key
export async function deriveAccountAddressFromPublicKey(
  publicKey: PublicKey, // the public key to derive the address for
  networkId: number // the Radix network id (stokenet = 0, mainnet = 1)
): Promise<string> {
  return RadixEngineToolkit.Derive.virtualAccountAddressFromPublicKey(
    publicKey,
    networkId
  );
}

// generates a private key from an array of bytes
export async function generateEd25519PrivateKey(
  bytes: Uint8Array // array of bytes representing the private key
): Promise<PrivateKey> {
  return new PrivateKey.Ed25519(bytes);
}

// generates a new account from a private key
export async function generateNewVirtualAccount(
  privateKey: PrivateKey, // the private key to use to generate the account
  networkId: number
): Promise<AccountData> {
  const publicKey = privateKey.publicKey();
  const address = await LTSRadixEngineToolkit.Derive.virtualAccountAddress(
    publicKey,
    networkId
  );
  return {
    privateKey,
    publicKey: publicKey,
    address,
    vaults: new Map(),
  };
}

// generates a hex seed from a mnemonic phrase
function mnemonicToSeed(mnemonic: string): string {
  return bip39.mnemonicToSeedSync(mnemonic).toString("hex");
}

// derivs private/public key pair using the privded derivation path and hex seed
function deriveKeyData(derivationPath: string, seedHex: string) {
  return derivePath(derivationPath, seedHex);
}
