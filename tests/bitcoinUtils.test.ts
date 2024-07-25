import { describe, expect, it } from 'vitest';
import {
  getAddressFromXpub,
  getXPub,
  mnemonicToAddress,
  mnemonicToAddressLeather,
  mnemonicToAddressXverse,
  mnemonicToPubKey,
  mnemonicToPubKeyLeather,
  mnemonicToPubKeyXverse,
  poxAddrToBtcAddr,
  validateAddress,
  wifToPrivateKey,
  wifToPublicKey,
} from '../src/functions/bitcoinUtils';
import { poxAddressToTuple } from '@stacks/stacking';

import {
  AddressType,
  Network,
  versions,
} from '../src/types/bitcoinUtils.types';

const mnemonicLeather =
  'jazz sibling error milk first mouse acid carpet slice able nothing desert uncover apology warm other speed cart library rhythm scrap crisp twenty magic';

const mnemonicXverse =
  'asset prefer seat story west regret voyage grain awesome dizzy chaos column';

describe('bitcoinHelpers tests', () => {
  it('test leather mainnet address derivation path p2wpkh', () => {
    const expected = 'bc1q38rfaervg7fahczswwdjyy3guxrsxspmf2e6x2';
    const actual = mnemonicToAddressLeather(mnemonicLeather);
    console.log('Generated address:::', actual);
    expect(actual).toEqual(expected);
  });

  it('test leather testnet address derivation path p2wpkh', () => {
    const expected = 'tb1qk6llyxu7cmzrvnq5wv6ku0ry4mwcujl7eeqtcn';

    const actual = mnemonicToAddressLeather(mnemonicLeather, 1);
    console.log('Generated address:::', actual);
    expect(actual).toEqual(expected);
  });

  it('test xverse mainnet address derivation path p2sh', () => {
    const expected = '35WkpG6BNSVVb1S6Gf8CPSAhnEU8Fom5Dv';
    const actual = mnemonicToAddressXverse(mnemonicXverse);
    console.log('Generated address:::', actual);
    expect(actual).toEqual(expected);
  });

  it('test xverse testnet address derivation path p2sh', () => {
    const expected = '2N9LD6CTA7zRWwPruDGjxEa6S5PQs8DKJqG';
    const actual = mnemonicToAddressXverse(mnemonicXverse, 1);
    console.log('Generated address:::', actual);
    expect(actual).toEqual(expected);
  });

  it('test leather testnet publicKey derivation path p2wpkh', () => {
    const expected =
      '020a90f590e1634aca4fe06a6bb483fbab3339b37141e6b5e81a4037ccb08b921b';
    const actual = mnemonicToPubKeyLeather(mnemonicLeather, 1);
    console.log('Generated Public Key::: ', actual);
    expect(actual).toEqual(expected);
  });

  it('test xverse testnet publicKey derivation path p2sh', () => {
    const expected =
      '03a244af0496ced3e34adf4abc92639164439c5dd631f3550d039d2a2399548d2d';
    const actual = mnemonicToPubKeyXverse(mnemonicXverse, 1);
    console.log('Generated Public Key:::', actual);
    expect(actual).toEqual(expected);
  });

  it('test poxAddrToBtcAddr function testnet leather', () => {
    const expected = 'tb1qk6llyxu7cmzrvnq5wv6ku0ry4mwcujl7eeqtcn';
    const poxAddr = poxAddressToTuple(
      mnemonicToAddressLeather(mnemonicLeather, 1)
    ).data;

    const { hashbytes } = poxAddr;
    const hashbytesString = Buffer.from(hashbytes.buffer).toString('hex');

    const actual = poxAddrToBtcAddr(
      versions.p2wpkh,
      hashbytesString,
      'testnet'
    );
    console.log('Generated address::: ', actual);

    expect(actual).toEqual(expected);
  });

  it('test poxAddrToBtcAddr function mainnet leather', () => {
    const expected = 'bc1q38rfaervg7fahczswwdjyy3guxrsxspmf2e6x2';
    const poxAddr = poxAddressToTuple(
      mnemonicToAddressLeather(mnemonicLeather)
    ).data;

    const { hashbytes } = poxAddr;
    const hashbytesString = Buffer.from(hashbytes.buffer).toString('hex');

    const actual = poxAddrToBtcAddr(
      versions.p2wpkh,
      hashbytesString,
      'mainnet'
    );
    console.log('Generated address::: ', actual);

    expect(actual).toEqual(expected);
  });

  it('test poxAddrToBtcAddr function testnet xverse', () => {
    const expected = '2N9LD6CTA7zRWwPruDGjxEa6S5PQs8DKJqG';
    const poxAddr = poxAddressToTuple(
      mnemonicToAddressXverse(mnemonicXverse, 1)
    ).data;

    const { hashbytes } = poxAddr;
    const hashbytesString = Buffer.from(hashbytes.buffer).toString('hex');

    const actual = poxAddrToBtcAddr(versions.p2sh, hashbytesString, 'testnet');
    console.log('Generated address::: ', actual);

    expect(actual).toEqual(expected);
  });

  it('test poxAddrToBtcAddr function mainnet xverse', () => {
    const expected = '35WkpG6BNSVVb1S6Gf8CPSAhnEU8Fom5Dv';
    const poxAddr = poxAddressToTuple(
      mnemonicToAddressXverse(mnemonicXverse)
    ).data;

    const { hashbytes } = poxAddr;
    const hashbytesString = Buffer.from(hashbytes.buffer).toString('hex');

    const actual = poxAddrToBtcAddr(versions.p2sh, hashbytesString, 'mainnet');
    console.log('Generated address::: ', actual);

    expect(actual).toEqual(expected);
  });

  it('get XPub', () => {
    const addressType: AddressType = 'p2sh';
    console.log(getXPub(mnemonicXverse, addressType));
  });

  it('xPub to btcAddress', () => {
    const xpub =
      'xpub6DH994sc1N881q3SP3T2NLK5cYEBgF4WRFPzeWjCWFdSF28fqskEPbV727RXrQLpkeYdSDV6Da6C7Cs9httVBqJBogYfRykNNGw1BJPLtNh';
    const expected = '35WkpG6BNSVVb1S6Gf8CPSAhnEU8Fom5Dv';
    const addressType: AddressType = 'p2sh';
    const actual = getAddressFromXpub(xpub, addressType, false, 0, 0);

    expect(actual).toEqual(expected);
  });

  it('validate btc address', () => {
    const expected = true;
    const actual = validateAddress(
      '35WkpG6BNSVVb1S6Gf8CPSAhnEU8Fom5Dv',
      Network.mainnet
    );
    expect(actual).toEqual(expected);
  });

  it('WIF to publicKey', () => {
    const expected =
      '025774620afbedb32e2fc27d3bd80eda4c1ad864a8713aa7f85e0a3870cfb9f295';
    const actual = wifToPublicKey(
      'Kx4x3XBJJqidCMnuSn2DHzQEwE7n5v1faUFwJkEGv74oLDWcdwMc'
    );
    expect(actual).toEqual(expected);
  });

  it('WIF to privateKey', () => {
    const expected =
      '1954942e409d6dfd62bd21a33c12ac34886b2edfcba6443fca2a2d1264860442';
    const actual = wifToPrivateKey(
      'Kx4x3XBJJqidCMnuSn2DHzQEwE7n5v1faUFwJkEGv74oLDWcdwMc'
    );
    expect(actual).toEqual(expected);
  });

  it('mnemonic to address', () => {
    const expected = '2N9LD6CTA7zRWwPruDGjxEa6S5PQs8DKJqG';
    const actual = mnemonicToAddress(mnemonicXverse, 'p2sh', 1);
    expect(actual).toEqual(expected);
  });

  it('mnemonic to publicKey', () => {
    const expected =
      '020a90f590e1634aca4fe06a6bb483fbab3339b37141e6b5e81a4037ccb08b921b';
    const actual = mnemonicToPubKey(mnemonicLeather, 'p2wpkh', 1);
    expect(actual).toEqual(expected);
  });
});
