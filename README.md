# Radix Account Creation Tools package

## Description

This package provides basic functions to create accounts for the Radix network using javascript/typescript.
Its aim is to serve as an example of how to do the basics but it is not a fool proof, production grade implementation.

The code was created from examples provided by the Radix team and from my own trial and error.

### ! IMPORTANT NOTE !

It is your responsibility to make sure you manage the security of the accounts you will use in your application. This package should only serve as a guide of how accounts can be created.

## Contributing to the code

The code was created from examples provided by the Radix team and from my own trial and error.
The idea is that this becomes a publicly maintained repository, so if you find any errors or would like to contribute in another way to the code or documentation, you are welcome to submit a pull request.

## Using the code in your project

### Clone repository

If you want to change the code for your own use, it would be best to clone the repository.

### Install as a package

If you just want to use the functionality in your project, you can install the package using Node Package Manager (npm):

```
npm install --save-dev radix-account-tools-js
```

### Update package to latest version

You can update the package to the latest version using npm:

```
npm install radix-account-tools-js@latest
```

### Run the demo functions

I created 2 demo functions to illustrate how the code could be used in an application.
The demo functions are in the ./src/demo.ts file.
If you have installed the package in your project using npm, you can run the demo functions with the following command from your project folder:

```
npm run demo
```

## Functions

### function: <span style="color:cyan">generate12WordMenomic</span>

Generates a 12 word mnemonic phrase that can be used for account creation

#### inputs

None

#### outputs

string containing 12 words separated by a comma

### function: <span style="color: cyan">generate24WordMenomic</span>

Generates a 24 word mnemonic phrase that can be used as a seed for account creation.

#### inputs

none

#### outputs

string: a string containing 24 words separated by a comma

### function <span style="color: cyan">generateAccountFromMnemonic</span> <span style="color: blue">async</span>

Creates an account from the provided mnomonic seed phrase and index.

#### inputs

string: The mnemonic seed phrase as a string of comma separated words
number: The index of the private/public key pair to use for account creation
number: The id number of the radix network for which to create the account (stokenet = 0, mainnet = 1)

#### outputs

AccountData: an object with the account keys and address

#### example

```
// generates an account from the given 24 word mnemonic phrase at index 5
let new_account = await generateAccountFromMnemonic(
  "test seed diet dose potato arrive bar oxygen secret ordinary science
    shaft cherry laptop timber tower online angle chest indicate mother
    ticket match type",
  5,
  0
);
```

### function <span style="color: cyan">generateAccountsFromMnemonic</span> <span style="color: blue">async</span>

Creates several accounts from the provided mnomonic seed phrase and indices.

#### inputs

string: The mnemonic seed phrase as a string of comma separated words
number Array: The indices of the private/public key pairs to use for account creation
number: The id number of the radix network for which to create the account (stokenet = 0, mainnet = 1)

#### outputs

AccountData Array: an array of objects with the account keys and address

#### example

```
// generates 3 accounts from the given 24 word mnemonic phrase with index 0, 3 and 5
let new_accounts = await generateAccountsFromMnemonic(
  "test seed diet dose potato arrive bar oxygen secret ordinary science
    shaft cherry laptop timber tower online angle chest indicate mother
    ticket match type",
  [0, 3, 5],
  0
);
```

### function <span style="color: cyan">generateAccountFromPrivateKeyBytes</span> <span style="color: blue">async</span>

Creates an account from the provided private key bytes.

#### inputs

UInt8 Array: An array of bytes (numbers) that is used to generate a private key
number: The id number of the radix network for which to create the account (stokenet = 0, mainnet = 1)

#### outputs

AccountData: an object with the account keys and address

#### example

```
let new_account = await generateAccountFromPrivateKeyBytes(UintArray.from(
  [
    59, 221, 206, 186, 244, 250, 32, 61, 48, 35, 211, 187, 215, 144, 255, 221,
    195, 4, 159, 158, 149, 222, 251, 113, 141, 82, 164, 202, 44, 150, 174, 79,
  ]
));
```

### function <span style="color: cyan">generateKeyPair</span>

Creates a private/public key pair from the provided provided mnemonic seed phrase and index.

#### inputs

string: The mnemonic seed phrase as a string of comma separated words

number: The index of the private/public key pair to use for account creation

number: The id number of the radix network for which to create the account (stokenet = 0, mainnet = 1)

number (optional: default = 525): The number representing the type of entity you want to create (account = 525, identity = 618)

#### outputs

KeyPair: an object with PrivateKey and PublicKey fields

#### example

```
// generates a private/public key pair for an account from the given 24 word mnemonic phrase with index 5
let new_keypair = generateKeyPair(
  "test seed diet dose potato arrive bar oxygen secret ordinary science
    shaft cherry laptop timber tower online angle chest indicate mother
    ticket match type",
  5,
  0
);
```

### function <span style="color: cyan">deriveAccountAddressFromPublicKey</span> <span style="color: blue">async</span>

Derives an account address from the provided public key

#### inputs

PublicKey: The pulbic key to derive an account address from

number: The id number of the radix network for which to create the account (stokenet = 0, mainnet = 1)

#### outputs

string: the radix global address of the account

#### example

```
let accountData = await generateAccountFromMnemonic(
  "test seed diet dose potato arrive bar oxygen secret ordinary science
    shaft cherry laptop timber tower online angle chest indicate mother
    ticket match type",
  5,
  0
)
// derives an account address from the provided public key
let account_address = await deriveAccountAddressFromPublicKey(
  accountData.publicKey,
  0
);
```

### function <span style="color: cyan">generateEd25519PrivateKey</span> <span style="color: blue">async</span>

Generates an Ed25519 private key from the provided bytes array

#### inputs

UInt8 Array: An array of bytes (numbers) that is used to generate a private key

#### outputs

PrivateKey: a private key object

#### example

```
let privateKey = await generateEd25519PrivateKey(UintArray.from(
  [
    59, 221, 206, 186, 244, 250, 32, 61, 48, 35, 211, 187, 215, 144, 255, 221,
    195, 4, 159, 158, 149, 222, 251, 113, 141, 82, 164, 202, 44, 150, 174, 79,
  ]
));
```

### function <span style="color: cyan">generateNewVirtualAccount</span> <span style="color: blue">async</span>

Generates a new account associated with the provided private key

#### inputs

PrivateKey: the private key to use for creating the account

number: The id number of the radix network for which to create the account (stokenet = 0, mainnet = 1)

#### outputs

AccountData: an object with the account keys and address

#### example

```
let newAccount = await generateVirtualAccount(
  privateKey,
  0
);
```

### function <span style="color: cyan">mnemonicToSeed</span>

Generates a hex seed from a mnemonic phrase

#### inputs

string: The mnemonic seed phrase as a string of comma separated words

#### outputs

string: a hex string that can be used as the seed for account derivation

#### example

```
let hexSeed = mnemonicToSeed(
  "test seed diet dose potato arrive bar oxygen secret ordinary science
    shaft cherry laptop timber tower online angle chest indicate mother
    ticket match type"
);
```

### function <span style="color: cyan">deriveKeyData</span>

derives private/public key data using the provided derivation path and hex seed

#### inputs

string: the derivation path used to determine the pay pair data
string: the hex seed string to use for the derivation

#### outputs

Keys: an object containing data used to derive private/public keys

#### example

```
let derivationPath =
  `m/44'/1022'/${networkId}'/${entityType}'/${KEY_TYPE.TRANSACTION_SIGNING}'/${entityIndex}'`
let hexSeed = mnemonicToSeed(
  "test seed diet dose potato arrive bar oxygen secret ordinary science
    shaft cherry laptop timber tower online angle chest indicate mother
    ticket match type"
);
let keyData = deriveKeyData(
  derivationPath,
  hexSeed,
);
```
