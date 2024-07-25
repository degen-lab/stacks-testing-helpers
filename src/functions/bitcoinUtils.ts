import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import * as tinysecp from 'tiny-secp256k1';
import { networks, payments } from 'bitcoinjs-lib';
import { poxAddressToBtcAddress } from '@stacks/stacking';
import {
  AddressType,
  Network,
  StacksNetwork,
  versions,
} from '../types/bitcoinUtils.types';
import validate from 'bitcoin-address-validation';
import ECPairFactory from 'ecpair';
import { bufferFromHex } from '@stacks/transactions/dist/cl';

const networkPayments = {
  mainnet: networks.bitcoin,
  testnet: networks.testnet,
};

/**
 * Derives the public key from a given mnemonic phrase using the specified derivation path for Leather Wallet (BIP84).
 *
 * @param mnemonic - The mnemonic phrase to generate the seed.
 * @param network - The network type (0 for mainnet, 1 for testnet). Default is 0 (mainnet).
 * @param accountIndex - The account index to use in the derivation path. Default is 0.
 * @param change - The change index to use in the derivation path. Default is 0.
 * @param addressIndex - The address index to use in the derivation path. Default is 0.
 * @returns The public key in hexadecimal format.
 */
export function mnemonicToPubKeyLeather(
  mnemonic: string,
  network: number = 0,
  accountIndex: number = 0,
  change: number = 0,
  addressIndex: number = 0
): string {
  const bip32Factory = bip32.BIP32Factory(tinysecp);

  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const root = bip32Factory.fromSeed(seed);

  const path = `m/84'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
  const child = root.derivePath(path);

  const { publicKey } = child;

  return publicKey.toString('hex');
}

/**
 * Derives the public key from a given mnemonic phrase using the specified derivation path for Xverse (BIP49).
 *
 * @param mnemonic - The mnemonic phrase to generate the seed.
 * @param network - The network type (0 for mainnet, 1 for testnet). Default is 0 (mainnet).
 * @param accountIndex - The account index to use in the derivation path. Default is 0.
 * @param change - The change index to use in the derivation path. Default is 0.
 * @param addressIndex - The address index to use in the derivation path. Default is 0.
 * @returns The public key in hexadecimal format.
 */
export function mnemonicToPubKeyXverse(
  mnemonic: string,
  network: number = 0,
  accountIndex: number = 0,
  change: number = 0,
  addressIndex: number = 0
): string {
  const bip32Factory = bip32.BIP32Factory(tinysecp);

  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const root = bip32Factory.fromSeed(seed);

  const path = `m/49'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
  const child = root.derivePath(path);

  const { publicKey } = child;
  return publicKey.toString('hex');
}

/**
 * Derives the address from a given mnemonic phrase using the specified derivation path for Leather Wallet (BIP84).
 *
 * @param mnemonic - The mnemonic phrase to generate the seed.
 * @param network - The network type (0 for mainnet, 1 for testnet). Default is 0 (mainnet).
 * @param accountIndex - The account index to use in the derivation path. Default is 0.
 * @param change - The change index to use in the derivation path. Default is 0.
 * @param addressIndex - The address index to use in the derivation path. Default is 0.
 * @returns The derived address.
 */
export function mnemonicToAddressLeather(
  mnemonic: string,
  network: number = 0,
  accountIndex: number = 0,
  change: number = 0,
  addressIndex: number = 0
): string {
  const actualNetwork =
    network === 1 ? networkPayments.testnet : networkPayments.mainnet;

  const publicKey = Buffer.from(
    bufferFromHex(
      mnemonicToPubKeyLeather(
        mnemonic,
        network,
        accountIndex,
        change,
        addressIndex
      )
    ).buffer
  );
  const { address } = payments.p2wpkh({
    pubkey: publicKey,
    network: actualNetwork,
  });
  if (!address) {
    throw new Error('Unable to derive address');
  }

  return address;
}

/**
 * Derives the address from a given mnemonic phrase using the specified derivation path for Xverse Wallet (BIP49).
 *
 * @param mnemonic - The mnemonic phrase to generate the seed.
 * @param network - The network type (0 for mainnet, 1 for testnet). Default is 0 (mainnet).
 * @param accountIndex - The account index to use in the derivation path. Default is 0.
 * @param change - The change index to use in the derivation path. Default is 0.
 * @param addressIndex - The address index to use in the derivation path. Default is 0.
 * @returns The derived address.
 */
export function mnemonicToAddressXverse(
  mnemonic: string,
  network: number = 0,
  accountIndex: number = 0,
  change: number = 0,
  addressIndex: number = 0
): string {
  const actualNetwork =
    network === 1 ? networkPayments.testnet : networkPayments.mainnet;

  const publicKey = Buffer.from(
    bufferFromHex(
      mnemonicToPubKeyXverse(
        mnemonic,
        network,
        accountIndex,
        change,
        addressIndex
      )
    ).buffer
  );
  const { address } = payments.p2sh({
    redeem: payments.p2wpkh({ pubkey: publicKey, network: actualNetwork }),
    network: actualNetwork,
  });
  if (!address) {
    throw new Error('Unable to derive address');
  }

  return address;
}

/**
 * Derives the private key from a given mnemonic phrase using the specified derivation path for Xverse Wallet (BIP49).
 *
 * @param mnemonic - The mnemonic phrase to generate the seed.
 * @param network - The network type (0 for mainnet, 1 for testnet). Default is 0 (mainnet).
 * @param accountIndex - The account index to use in the derivation path. Default is 0.
 * @param change - The change index to use in the derivation path. Default is 0.
 * @param addressIndex - The address index to use in the derivation path. Default is 0.
 * @returns The private key in hexadecimal format.
 */
export function mnemonicToPrivKeyXverse(
  mnemonic: string,
  network: number = 0,
  accountIndex: number = 0,
  change: number = 0,
  addressIndex: number = 0
): string {
  const bip32Factory = bip32.BIP32Factory(tinysecp);

  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const root = bip32Factory.fromSeed(seed);

  const path = `m/49'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
  const child = root.derivePath(path);

  const { privateKey } = child;
  return privateKey!.toString('hex');
}

/**
 * Derives the private key from a given mnemonic phrase using the specified derivation path for Leather Wallet (BIP84).
 *
 * @param mnemonic - The mnemonic phrase to generate the seed.
 * @param network - The network type (0 for mainnet, 1 for testnet). Default is 0 (mainnet).
 * @param accountIndex - The account index to use in the derivation path. Default is 0.
 * @param change - The change index to use in the derivation path. Default is 0.
 * @param addressIndex - The address index to use in the derivation path. Default is 0.
 * @returns The private key in hexadecimal format.
 */
export function mnemonicToPrivKeyLeather(
  mnemonic: string,
  network: number = 0,
  accountIndex: number = 0,
  change: number = 0,
  addressIndex: number = 0
): string {
  const bip32Factory = bip32.BIP32Factory(tinysecp);

  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const root = bip32Factory.fromSeed(seed);

  const path = `m/84'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
  const child = root.derivePath(path);

  const { privateKey } = child;

  return privateKey!.toString('hex');
}

/**
 * Converts a PoX address to a BTC address.
 *
 * @param version - The version representing the address type (e.g., '00' for p2pkh, '01' for p2sh).
 * @param hashbytes - The hash bytes in hexadecimal format.
 * @param network - The Stacks network to determine the network type.
 * @returns The corresponding BTC address.
 */
export function poxAddrToBtcAddr(
  version: versions,
  hashbytes: string,
  network: StacksNetwork
): string {
  return poxAddressToBtcAddress(
    parseInt(version, 10),
    bufferFromHex(hashbytes).buffer,
    network
  );
}

/**
 * Derives the extended public key (xPub) from a given mnemonic phrase using the specified derivation path.
 *
 * @param mnemonic - The mnemonic phrase to generate the seed.
 * @param addressType - The type of address to derive (p2pkh, p2sh, p2wpkh, p2wsh, p2tr).
 * @param network - The network type (0 for mainnet, 1 for testnet). Default is 0 (mainnet).
 * @param accountIndex - The account index to use in the derivation path. Default is 0.
 * @returns The extended public key (xPub) in Base58 format.
 */
export function getXPub(
  mnemonic: string,
  addressType: AddressType,
  network: number = 0,
  accountIndex: number = 0
): string {
  const bip32Factory = bip32.BIP32Factory(tinysecp);

  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32Factory.fromSeed(seed);

  let path: string;
  switch (addressType) {
    case 'p2pkh':
      path = `m/44'/${network}'/${accountIndex}'`;
      break;
    case 'p2sh':
      path = `m/49'/${network}'/${accountIndex}'`;
      break;
    case 'p2wpkh':
      path = `m/84'/${network}'/${accountIndex}'`;
      break;
    case 'p2wsh':
      path = `m/48'/${network}'/${accountIndex}'`;
      break;
    case 'p2tr':
      path = `m/86'/${network}'/${accountIndex}'`;
      break;
    default:
      throw new Error('Unsupported address type');
  }

  const xPub = root.derivePath(path).neutered().toBase58();
  return xPub;
}

/**
 * Derives the address from a given extended public key (xPub) using the specified derivation path.
 *
 * @param xpub - The extended public key (xPub) in Base58 format.
 * @param addressType - The type of address to derive (p2pkh, p2sh, p2wpkh, p2wsh, p2tr).
 * @param isTestnet - Indicates if the address should be derived for the testnet. Default is false (mainnet).
 * @param change - The change index to use in the derivation path. Default is 0.
 * @param addressIndex - The address index to use in the derivation path. Default is 0.
 * @returns The derived address.
 */
export function getAddressFromXpub(
  xpub: string,
  addressType: AddressType,
  isTestnet: boolean = false,
  change: number = 0,
  addressIndex: number = 0
): string {
  const network = isTestnet ? networks.testnet : networks.bitcoin;
  const bip32Factory = bip32.BIP32Factory(tinysecp);
  const node = bip32Factory.fromBase58(xpub, network);

  const child = node.derive(change).derive(addressIndex);

  let address: string;

  switch (addressType) {
    case 'p2pkh':
      address = payments.p2pkh({ pubkey: child.publicKey, network }).address!;
      break;
    case 'p2sh':
      const p2wpkh = payments.p2wpkh({ pubkey: child.publicKey, network });
      address = payments.p2sh({ redeem: p2wpkh, network }).address!;
      break;
    case 'p2wpkh':
      address = payments.p2wpkh({ pubkey: child.publicKey, network }).address!;
      break;
    case 'p2wsh':
      const p2wsh = payments.p2wsh({
        redeem: payments.p2ms({
          m: 2,
          pubkeys: [child.publicKey],
          network,
        }),
        network,
      });
      address = p2wsh.address!;
      break;
    case 'p2tr':
      address = payments.p2tr({
        internalPubkey: child.publicKey.slice(1, 33),
        network,
      }).address!;
      break;
    default:
      throw new Error('Unsupported address type');
  }

  return address;
}

/**
 * Validates a given Bitcoin address for the specified network.
 *
 * @param btcAddress - The Bitcoin address to validate.
 * @param network - The network type (mainnet or testnet).
 * @returns True if the address is valid for the specified network, otherwise false.
 */
export function validateAddress(btcAddress: string, network: Network): boolean {
  return validate(btcAddress, network);
}

/**
 * Converts a WIF (Wallet Import Format) key to a public key in hexadecimal format.
 *
 * @param wif - The WIF (Wallet Import Format) key.
 * @param network - The network type (0 for mainnet, 1 for testnet). Default is 0 (mainnet).
 * @returns The public key in hexadecimal format.
 */
export function wifToPublicKey(wif: string, network: number = 0): string {
  const actualNetwork =
    network === 1 ? networkPayments.testnet : networkPayments.mainnet;

  const ECPair = ECPairFactory(tinysecp);
  const keyPair = ECPair.fromWIF(wif, actualNetwork);
  return Buffer.from(keyPair.publicKey).toString('hex');
}

/**
 * Converts a WIF (Wallet Import Format) key to a private key in hexadecimal format.
 *
 * @param wif - The WIF (Wallet Import Format) key.
 * @param network - The network type (0 for mainnet, 1 for testnet). Default is 0 (mainnet).
 * @returns The private key in hexadecimal format.
 */
export function wifToPrivateKey(wif: string, network: number = 0): string {
  const actualNetwork =
    network === 1 ? networkPayments.testnet : networkPayments.mainnet;

  const ECPair = ECPairFactory(tinysecp);
  const keyPair = ECPair.fromWIF(wif, actualNetwork);
  return Buffer.from(keyPair.privateKey!).toString('hex');
}

/**
 * Derives a Bitcoin address from a given mnemonic phrase using the specified derivation path.
 *
 * @param mnemonic - The mnemonic phrase to generate the seed.
 * @param addressType - The type of address to derive (p2pkh, p2sh, p2wpkh, p2wsh, p2tr).
 * @param network - The network type (0 for mainnet, 1 for testnet). Default is 0 (mainnet).
 * @param accountIndex - The account index to use in the derivation path. Default is 0.
 * @param change - The change index to use in the derivation path. Default is 0.
 * @param addressIndex - The address index to use in the derivation path. Default is 0.
 * @returns The derived address.
 */
export function mnemonicToAddress(
  mnemonic: string,
  addressType: AddressType,
  network: number = 0,
  accountIndex: number = 0,
  change: number = 0,
  addressIndex: number = 0
): string {
  const actualNetwork = network === 1 ? networks.testnet : networks.bitcoin;

  const bip32Factory = bip32.BIP32Factory(tinysecp);

  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const root = bip32Factory.fromSeed(seed);

  let address: string;
  let path: string;
  let child: bip32.BIP32Interface;

  switch (addressType) {
    case 'p2pkh':
      path = `m/44'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      address = payments.p2pkh({
        pubkey: child.publicKey,
        network: actualNetwork,
      }).address!;
      break;
    case 'p2sh':
      path = `m/49'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      const p2wpkh = payments.p2wpkh({
        pubkey: child.publicKey,
        network: actualNetwork,
      });
      address = payments.p2sh({ redeem: p2wpkh, network: actualNetwork })
        .address!;
      break;
    case 'p2wpkh':
      path = `m/84'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      address = payments.p2wpkh({
        pubkey: child.publicKey,
        network: actualNetwork,
      }).address!;
      break;
    case 'p2wsh':
      path = `m/48'/${network}'/${accountIndex}'/2'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      const p2wsh = payments.p2wsh({
        redeem: payments.p2ms({
          m: 2,
          pubkeys: [child.publicKey],
          network: actualNetwork,
        }),
        network: actualNetwork,
      });
      address = p2wsh.address!;
      break;
    case 'p2tr':
      path = `m/86'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      address = payments.p2tr({
        internalPubkey: child.publicKey.slice(1, 33),
        network: actualNetwork,
      }).address!;
      break;
    default:
      throw new Error('Unsupported address type');
  }

  return address;
}

/**
 * Derives a public key from a given mnemonic phrase using the specified derivation path.
 *
 * @param mnemonic - The mnemonic phrase to generate the seed.
 * @param addressType - The type of address to derive (p2pkh, p2sh, p2wpkh, p2wsh, p2tr).
 * @param network - The network type (0 for mainnet, 1 for testnet). Default is 0 (mainnet).
 * @param accountIndex - The account index to use in the derivation path. Default is 0.
 * @param change - The change index to use in the derivation path. Default is 0.
 * @param addressIndex - The address index to use in the derivation path. Default is 0.
 * @returns The derived public key in hexadecimal format.
 */
export function mnemonicToPubKey(
  mnemonic: string,
  addressType: AddressType,
  network: number = 0,
  accountIndex: number = 0,
  change: number = 0,
  addressIndex: number = 0
): string {
  const bip32Factory = bip32.BIP32Factory(tinysecp);

  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const root = bip32Factory.fromSeed(seed);

  let path: string;
  let child: bip32.BIP32Interface;

  switch (addressType) {
    case 'p2pkh':
      path = `m/44'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      break;
    case 'p2sh':
      path = `m/49'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      break;
    case 'p2wpkh':
      path = `m/84'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      break;
    case 'p2wsh':
      path = `m/48'/${network}'/${accountIndex}'/2'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      break;
    case 'p2tr':
      path = `m/86'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      break;
    default:
      throw new Error('Unsupported address type');
  }

  const { publicKey } = child;

  return publicKey.toString('hex');
}

/**
 * Derives a private key from a given mnemonic phrase using the specified derivation path.
 *
 * @param mnemonic - The mnemonic phrase to generate the seed.
 * @param addressType - The type of address to derive (p2pkh, p2sh, p2wpkh, p2wsh, p2tr).
 * @param network - The network type (0 for mainnet, 1 for testnet). Default is 0 (mainnet).
 * @param accountIndex - The account index to use in the derivation path. Default is 0.
 * @param change - The change index to use in the derivation path. Default is 0.
 * @param addressIndex - The address index to use in the derivation path. Default is 0.
 * @returns The derived private key in hexadecimal format.
 */
export function mnemonicToPrivKey(
  mnemonic: string,
  addressType: AddressType,
  network: number = 0,
  accountIndex: number = 0,
  change: number = 0,
  addressIndex: number = 0
): string {
  const bip32Factory = bip32.BIP32Factory(tinysecp);

  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const root = bip32Factory.fromSeed(seed);

  let path: string;
  let child: bip32.BIP32Interface;

  switch (addressType) {
    case 'p2pkh':
      path = `m/44'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      break;
    case 'p2sh':
      path = `m/49'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      break;
    case 'p2wpkh':
      path = `m/84'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      break;
    case 'p2wsh':
      path = `m/48'/${network}'/${accountIndex}'/2'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      break;
    case 'p2tr':
      path = `m/86'/${network}'/${accountIndex}'/${change}/${addressIndex}`;
      child = root.derivePath(path);
      break;
    default:
      throw new Error('Unsupported address type');
  }

  const { privateKey } = child;

  return privateKey!.toString('hex');
}
