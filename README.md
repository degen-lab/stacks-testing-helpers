# stacks-testing-helpers [![npm](https://img.shields.io/npm/v/stacks-testing-helpers?color=red)](https://www.npmjs.com/package/stacks-testing-helpers)

This library provides a convenient wrapper for testing and developing on Bitcoin and Stacks. It offers helper functions to mock different scenarios.

The functions which require simnet can only be used inside a [clarinet](https://github.com/hirosystems/clarinet?tab=readme-ov-file#getting-started-with-clarinet) project.

## Contents

<details>
  <summary>PoxHelpers</summary>
  <ul>
    <li><a href="#currentrewardcyclemock">currentRewardCycleMock</a></li>
    <li><a href="#burnheighttorewardcyclemock">burnHeightToRewardCycleMock</a></li>
    <li><a href="#rewardcycletoburnheightmock">rewardCycleToBurnHeightMock</a></li>
    <li><a href="#getpoxinfomock">getPoxInfoMock</a></li>
    <li><a href="#getstackingminimummock">getStackingMinimumMock</a></li>
    <li><a href="#blocksuntilrewardphasemock">blocksUntilRewardPhaseMock</a></li>
    <li><a href="#customblocksuntilrewardphasemock">customBlocksUntilRewardPhaseMock</a></li>
    <li><a href="#blocksuntilpreparephasemock">blocksUntilPreparePhaseMock</a></li>
    <li><a href="#customblocksuntilpreparephasemock">customBlocksUntilPreparePhaseMock</a></li>
    <li><a href="#isinpreparephasemock">isInPreparePhaseMock</a></li>
  </ul>
</details>

<details>
  <summary>StacksUtils</summary>
  <ul>
    <li><a href="#burnblockheight">burnBlockHeight</a></li>
    <li><a href="#chainid">chainId</a></li>
    <li><a href="#contractcaller">contractCaller</a></li>
    <li><a href="#stxliquidsupply">stxLiquidSupply</a></li>
    <li><a href="#stxaccount">stxAccount</a></li>
    <li><a href="#getdatavar">getDataVar</a></li>
    <li><a href="#getmapentry">getMapEntry</a></li>
  </ul>
</details>

<details>
  <summary>BitcoinUtils</summary>
  <ul>
    <li><a href="#mnemonictopubkeyleather">mnemonicToPubKeyLeather</a></li>
    <li><a href="#mnemonictopubkeyxverse">mnemonicToPubKeyXverse</a></li>
    <li><a href="#mnemonictoaddressleather">mnemonicToAddressLeather</a></li>
    <li><a href="#mnemonictoaddressxverse">mnemonicToAddressXverse</a></li>
    <li><a href="#mnemonictoprivkeyleather">mnemonicToPrivKeyLeather</a></li>
    <li><a href="#mnemonictoprivkeyxverse">mnemonicToPrivKeyXverse</a></li>
    <li><a href="#poxaddrtobtcaddr">poxAddrToBtcAddr</a></li>
    <li><a href="#getxpub">getXPub</a></li>
    <li><a href="#getaddressfromxpub">getAddressFromXpub</a></li>
    <li><a href="#validateaddress">validateAddress</a></li>
    <li><a href="#wiftopublickey">wifToPublicKey</a></li>
    <li><a href="#wiftoprivatekey">wifToPrivateKey</a></li>
    <li><a href="#mnemonictoaddress">mnemonicToAddress</a></li>
    <li><a href="#mnemonictopubkey">mnemonicToPubKey</a></li>
    <li><a href="#mnemonictoprivkey">mnemonicToPrivKey</a></li>
  </ul>
</details>

## PoxHelpers

### currentRewardCycleMock

This function is used for getting the current reward cycle of the given Simnet instance.

```typescript
import { currentRewardCycleMock } from 'stacks-testing-helpers';

const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // STX address

const currentRewardCycle = currentRewardCycleMock(simnet, address);
```

### burnHeightToRewardCycleMock

This function is used for identifying what cycle a given burn height belongs to for a given Simnet instance.

```typescript
import { burnHeightToRewardCycleMock } from 'stacks-testing-helpers';

const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // STX address
const height = 2050; //any number

const rewardCycle = burnHeightToRewardCycleMock(simnet, address, height);
```

### rewardCycleToBurnHeightMock

This function is used for getting the burn height that a cycle starts at for a given Simnet instance.

```typescript
import { rewardCycleToBurnHeightMock } from 'stacks-testing-helpers';

const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // STX address
const rewCycle = 2; //any number

const burnHeight = rewardCycleToBurnHeightMock(simnet, address, rewCycle);
```

### getPoxInfoMock

This function is used for getting the following information about the pox contract as a javascript dictionary:

- 'first-burnchain-block-height': The activation burn height of the PoX Contract.
- 'min-amount-ustx': The minimum amount of uSTX required for a stacking slot.
- 'prepare-cycle-length': The length of the preparation cycle (in burn blocks).
- 'reward-cycle-id': The identifier of the reward cycle.
- 'reward-cycle-length': The length of the reward cycle (in burn blocks).
- 'total-liquid-supply-ustx': The total liquid supply of uSTX.

```typescript
import { getPoxInfoMock } from 'stacks-testing-helpers';

const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // STX address

const poxInfo = getPoxInfoMock(simnet, address);
```

### getStackingMinimumMock

This function is used for getting the stacking minimum of the pox contract for a given Simnet instance.

```typescript
import { getStackingMinimumMock } from 'stacks-testing-helpers';

const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // STX address

const stackingMinimum = getStackingMinimumMock(simnet, address);
```

### blocksUntilRewardPhaseMock

This function is used for getting the remaining blocks until the start of the next reward phase for a given Simnet instance, if the current block is a reward phase block then it will return 0.

```typescript
import { blocksUntilRewardPhaseMock } from 'stacks-testing-helpers';

const blocksUntilRew = blocksUntilRewardPhaseMock(simnet);
```

### customBlocksUntilRewardPhaseMock

This function is used for getting the remaining blocks before the reward phase begins for a given burn
height with the default `rewardCycleLength = 1050`, `prepareCycleLength = 50`, `startBurnHeight = 0`, if the given burn block is a reward phase block then it will return 0.

```typescript
import { customBlocksUntilRewardPhaseMock } from 'stacks-testing-helpers';

const burnHeight = 2005;

const blocksUntilRew = customBlocksUntilRewardPhaseMock(burnHeight);
```

Also there can be entered custom `rewardCycleLength`, `prepareCycleLength`, `startBurnHeight`:

```typescript
import { customBlocksUntilRewardPhaseMock } from 'stacks-testing-helpers';

const burnHeight = 2005;
const rewardCycleLength = 40;
const prepareCycleLength = 500;
const startBurnHt = 100;

const blocksUntilRew = customBlocksUntilRewardPhaseMock(
  burnHeight,
  rewardCycleLength,
  prepareCycleLength,
  startBurnHt
);
```

### blocksUntilPreparePhaseMock

This function is used for getting the remaining blocks until the start of the next prepare phase for a given Simnet instance, if the current block is a prepare phase block then it will return 0.

```typescript
import { blocksUntilPreparePhaseMock } from 'stacks-testing-helpers';

const blocksUntilPrepare = blocksUntilPreparePhaseMock(simnet);
```

### customBlocksUntilPreparePhaseMock

This function is used for getting the remaining blocks before the prepare phase begins for a given burn
height with the default `rewardCycleLength = 1050`, `prepareCycleLength = 50`, `startBurnHeight = 0`, if the given burn block is a prepare phase block then it will return 0.

```typescript
import { customBlocksUntilPreparePhaseMock } from 'stacks-testing-helpers';

const blockHeight = 2005;

const blocksUntilRew = customBlocksUntilPreparePhaseMock(blockHeight);
```

Also there can be entered custom `rewardCycleLength`, `prepareCycleLength`, `startBurnHeight`:

```typescript
import { customBlocksUntilPreparePhaseMock } from 'stacks-testing-helpers';

const blockHeight = 2005;
const rewardCycleLength = 40;
const prepareCycleLength = 500;
const startBurnHt = 100;

const blocksUntilPrepare = customBlocksUntilPreparePhaseMock(
  blockHeight,
  rewardCycleLength,
  prepareCycleLength,
  startBurnHt
);
```

### isInPreparePhaseMock

This function is used for checking if the given burn height is a prepare phase block of a given Simnet instance, returning a boolean.

```typescript
import { isInPreparePhaseMock } from 'stacks-testing-helpers';

const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // STX address
const burnHeight = 2059;

const isPreparePhase = isInPreparePhaseMock(simnet, address, height);
```

## StacksUtils

### burnBlockHeight

This function queries the Simnet instance to retrieve the current burn block height.

```typescript
import { burnBlockHeight } from 'stacks-testing-helpers';

const burnHeight = burnBlockHeight(simnet);
```

### chainId

This function queries the Simnet instance to retrieve the chain ID.

```typescript
import { chainId } from 'stacks-testing-helpers';

const id = chainId(simnet);
```

### contractCaller

This function queries the Simnet instance to retrieve the contract caller.

```typescript
import { contractCaller } from 'stacks-testing-helpers';

const caller = contractCaller(simnet);
```

### stxLiquidSupply

This function queries the Simnet instance to retrieve the current liquid supply of STX.

```typescript
import { stxLiquidSupply } from 'stacks-testing-helpers';

const liquidSupply = stxLiquidSupply(simnet);
```

### stxAccount

This function queries the Simnet instance to retrieve the details of the specified STX account as a javascript dictionary:

- 'locked': The locked amount in ustx.
- 'unlock-height': The height where the locked amount will be unlocked.
- 'unlocked': The unlocked amount in ustx.

```typescript
import { stxAccount } from 'stacks-testing-helpers';

const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // STX address

const account = stxAccount(simnet, address);
```

### getDataVar

This function queries the Simnet instance to retrieve the value of a specific data variable from the specified contract.

```typescript
import { getDataVar } from 'stacks-testing-helpers';

const contract = 'your-contract';
const varName = 'your-data-variable';

const dataVar = getDataVar(simnet, contract, varName);
```

### getMapEntry

This function queries the Simnet instance to retrieve the entry of a specific map, identified by its name and key (as ClarityValue), from the specified contract.

```typescript
import { getMapEntry } from 'stacks-testing-helpers';
import { Cl } from '@stacks/transactions';

const contract = 'your-contract';
const mapName = 'your-map-name';
const mapKey = Cl.tuple({ 'your-key': 'your-value' });

const mapEntry = getMapEntry(simnet, contract, mapName, mapKey);
```

## BitcoinUtils

### mnemonicToPubKeyLeather

This function derives the public key from a given mnemonic phrase using the specified derivation path for Leather Wallet (BIP84) with the default values `network = 0`, `accountIndex = 0`, `change = 0` and `addressIndex = 0`.

```typescript
import { mnemonicToPubKeyLeather } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';

const pubKey = mnemonicToPubKeyLeather(mnemonic);
```

There can also be custom values:

```typescript
import { mnemonicToPubKeyLeather } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const network = 1;
const accountIndex = 1;
const change = 0;
const addressIndex = 2;

const pubKey = mnemonicToPubKeyLeather(
  mnemonic,
  network,
  accountIndex,
  change,
  addressIndex
);
```

### mnemonicToPubKeyXverse

This function derives the public key from a given mnemonic phrase using the specified derivation path for Xverse (BIP49) with the default values `network = 0`, `accountIndex = 0`, `change = 0` and `addressIndex = 0`.

```typescript
import { mnemonicToPubKeyXverse } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';

const publicKey = mnemonicToPubKeyXverse(mnemonic);
```

There can also be custom values:

```typescript
import { mnemonicToPubKeyXverse } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const network = 1;
const accountIndex = 1;
const change = 0;
const addressIndex = 2;

const publicKey = mnemonicToPubKeyXverse(
  mnemonic,
  network,
  accountIndex,
  change,
  addressIndex
);
```

### mnemonicToAddressLeather

This function derives the address from a given mnemonic phrase using the specified derivation path for Leather Wallet (BIP84) with the default values `network = 0`, `accountIndex = 0`, `change = 0` and `addressIndex = 0`.

```typescript
import { mnemonicToAddressLeather } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';

const address = mnemonicToAddressLeather(mnemonic);
```

There can also be custom values:

```typescript
import { mnemonicToAddressLeather } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const network = 1;
const accountIndex = 1;
const change = 0;
const addressIndex = 2;

const address = mnemonicToAddressLeather(
  mnemonic,
  network,
  accountIndex,
  change,
  addressIndex
);
```

### mnemonicToAddressXverse

This function derives the address from a given mnemonic phrase using the specified derivation path for Xverse Wallet (BIP49) with the default values `network = 0`, `accountIndex = 0`, `change = 0` and `addressIndex = 0`.

```typescript
import { mnemonicToAddressXverse } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';

const address = mnemonicToAddressXverse(mnemonic);
```

There can also be custom values:

```typescript
import { mnemonicToAddressXverse } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const network = 1;
const accountIndex = 1;
const change = 0;
const addressIndex = 2;

const address = mnemonicToAddressXverse(
  mnemonic,
  network,
  accountIndex,
  change,
  addressIndex
);
```

### mnemonicToPrivKeyLeather

This function derives the private key from a given mnemonic phrase using the specified derivation path for Leather Wallet (BIP84) with the default values `network = 0`, `accountIndex = 0`, `change = 0` and `addressIndex = 0`.

```typescript
import { mnemonicToPrivKeyLeather } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';

const privateKey = mnemonicToPrivKeyLeather(mnemonic);
```

There can also be custom values:

```typescript
import { mnemonicToPrivKeyLeather } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const network = 1;
const accountIndex = 1;
const change = 0;
const addressIndex = 2;

const privateKey = mnemonicToPrivKeyLeather(
  mnemonic,
  network,
  accountIndex,
  change,
  addressIndex
);
```

### mnemonicToPrivKeyXverse

This function derives the private key from a given mnemonic phrase using the specified derivation path for Xverse Wallet (BIP49) with the default values `network = 0`, `accountIndex = 0`, `change = 0` and `addressIndex = 0`.

```typescript
import { mnemonicToPrivKeyXverse } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';

const privateKey = mnemonicToPrivKeyXverse(mnemonic);
```

There can also be custom values:

```typescript
import { mnemonicToPrivKeyXverse } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const network = 1;
const accountIndex = 1;
const change = 0;
const addressIndex = 2;

const privateKey = mnemonicToPrivKeyXverse(
  mnemonic,
  network,
  accountIndex,
  change,
  addressIndex
);
```

### poxAddrToBtcAddr

This function converts a PoX address to a BTC address.

```typescript
import { poxAddrToBtcAddr, versions } from 'stacks-testing-helpers';

const version = versions.your_version;
const hashbytes = 'hashbytes';
const network = 'mainnet'; // or 'testnet' or 'devnet' or 'mocknet'

const address = poxAddrToBtcAddr(version, hashbytes, network);
```

### getXPub

This function derives the extended public key (xPub) from a given mnemonic phrase using the specified derivation path with the default values `network = 0` and `accountIndex = 0`.

```typescript
import { getXPub, AddressType } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const addressType = 'your_address_type'; // "p2pkh" | "p2sh" | "p2wpkh" | "p2wsh" | "p2tr";

const xPub = getXPub(mnemonic, addressType);
```

There can also be custom values:

```typescript
import { getXPub, AddressType } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const addressType = 'your_address_type'; // "p2pkh" | "p2sh" | "p2wpkh" | "p2wsh" | "p2tr";
const network = 1;
const accountIndex = 2;

const xPub = getXPub(mnemonic, addressType, network, accountIndex);
```

### getAddressFromXpub

This function derives the address from a given extended public key (xPub) using the specified derivation path with the default values `isTestnet = false`, `change = 0` and `addressIndex = 0`.

```typescript
import { getAddressFromXpub, AddressType } from 'stacks-testing-helpers';

const xpub = 'your-xpub';
const addressType = 'your_address_type'; // "p2pkh" | "p2sh" | "p2wpkh" | "p2wsh" | "p2tr";

const address = getAddressFromXpub(xpub, addressType);
```

There can also be custom values:

```typescript
import { getAddressFromXpub, AddressType } from 'stacks-testing-helpers';

const xpub = 'your-xpub';
const addressType = 'your_address_type'; // "p2pkh" | "p2sh" | "p2wpkh" | "p2wsh" | "p2tr";
const network = 1;
const accountIndex = 2;

const address = getAddressFromXpub(xpub, addressType, network, accountIndex);
```

### validateAddress

This function validates a given Bitcoin address for the specified network.

```typescript
import { validateAddress, Network } from 'stacks-testing-helpers';

const btcAddress = 'your-btc-address';
const network = Network.your_network;

const valid = validateAddress(btcAddress, network);
```

### wifToPublicKey

This function converts a WIF (Wallet Import Format) key to a public key in hexadecimal format with default `network = 0` for mainnet.

```typescript
import { wifToPublicKey } from 'stacks-testing-helpers';

const wif = 'your-wif';

const publicKey = wifToPublicKey(btcAddress);
```

There can also be custom values:

```typescript
import { wifToPublicKey } from 'stacks-testing-helpers';

const wif = 'your-wif';
const network = 1; // for testnet

const publicKey = wifToPublicKey(btcAddress, network);
```

### wifToPrivateKey

This function converts a WIF (Wallet Import Format) key to a private key in hexadecimal format with default `network = 0` for mainnet.

```typescript
import { wifToPrivateKey } from 'stacks-testing-helpers';

const wif = 'your-wif';

const privateKey = wifToPrivateKey(btcAddress);
```

There can also be custom values:

```typescript
import { wifToPrivateKey } from 'stacks-testing-helpers';

const wif = 'your-wif';
const network = 1; // for testnet

const privateKey = wifToPrivateKey(btcAddress, network);
```

### mnemonicToAddress

This function derives a Bitcoin address from a given mnemonic phrase using the specified derivation path with the default values `network = 0`, `accountIndex = 0`, `change = 0` and `addressIndex = 0`.

```typescript
import { mnemonicToAddress } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const addressType = 'your_address_type'; // "p2pkh" | "p2sh" | "p2wpkh" | "p2wsh" | "p2tr";

const address = mnemonicToAddress(mnemonic, addressType);
```

There can also be custom values:

```typescript
import { mnemonicToAddress } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const addressType = 'your_address_type'; // "p2pkh" | "p2sh" | "p2wpkh" | "p2wsh" | "p2tr";
const network = 1;
const accountIndex = 1;
const change = 0;
const addressIndex = 2;

const address = mnemonicToAddress(
  mnemonic,
  addressType,
  network,
  accountIndex,
  change,
  addressIndex
);
```

### mnemonicToPubKey

This function derives a public key from a given mnemonic phrase using the specified derivation path with the default values `network = 0`, `accountIndex = 0`, `change = 0` and `addressIndex = 0`.

```typescript
import { mnemonicToPubKey } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const addressType = 'your_address_type'; // "p2pkh" | "p2sh" | "p2wpkh" | "p2wsh" | "p2tr";

const publicKey = mnemonicToPubKey(mnemonic, addressType);
```

There can also be custom values:

```typescript
import { mnemonicToPubKey } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const addressType = 'your_address_type'; // "p2pkh" | "p2sh" | "p2wpkh" | "p2wsh" | "p2tr";
const network = 1;
const accountIndex = 1;
const change = 0;
const addressIndex = 2;

const publicKey = mnemonicToPubKey(
  mnemonic,
  addressType,
  network,
  accountIndex,
  change,
  addressIndex
);
```

### mnemonicToPrivKey

This function derives a private key from a given mnemonic phrase using the specified derivation path with the default values `network = 0`, `accountIndex = 0`, `change = 0` and `addressIndex = 0`.

```typescript
import { mnemonicToAddress } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const addressType = 'your_address_type'; // "p2pkh" | "p2sh" | "p2wpkh" | "p2wsh" | "p2tr";

const privateKey = mnemonicToPrivKey(mnemonic, addressType);
```

There can also be custom values:

```typescript
import { mnemonicToPrivKey } from 'stacks-testing-helpers';

const mnemonic = 'your-mnemonic-phrase';
const addressType = 'your_address_type'; // "p2pkh" | "p2sh" | "p2wpkh" | "p2wsh" | "p2tr";
const network = 1;
const accountIndex = 1;
const change = 0;
const addressIndex = 2;

const privateKey = mnemonicToPrivKey(
  mnemonic,
  addressType,
  network,
  accountIndex,
  change,
  addressIndex
);
```
