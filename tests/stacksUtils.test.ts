import { initSimnet } from '@hirosystems/clarinet-sdk';
import { Cl, createStacksPrivateKey } from '@stacks/transactions';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  burnBlockHeight,
  chainId,
  contractCaller,
  getDataVar,
  getMapEntry,
  stxAccount,
  stxLiquidSupply,
} from '../src/functions/stacksUtils';
import {
  Pox4SignatureTopic,
  StackingClient,
  poxAddressToTuple,
} from '@stacks/stacking';
import { getPublicKeyFromPrivate } from '@stacks/encryption';
import { StacksDevnet } from '@stacks/network';
import { currentRewardCycleJS } from '../src/functions/poxHelpers';

const simnet = await initSimnet();
const deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const stxAddresses = [
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
  'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND',
  'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
  'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0',
  'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ',
  'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP',
  'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6',
];
const pox4 = 'ST000000000000000000002AMW42H.pox-4';
const testContract = `${deployer}.test`;

describe('test stacksUtils functions', () => {
  it('burn-block-height', () => {
    fc.assert(
      fc.property(fc.nat(2500), (nrBlocks) => {
        // Arrange
        const prevBurnHeight = burnBlockHeight(simnet);
        simnet.mineEmptyBlocks(nrBlocks);
        const expected = prevBurnHeight + nrBlocks;

        // Act
        const actual = burnBlockHeight(simnet);

        // Expect
        expect(actual).toEqual(expected);
      })
    );
  });

  it('chain-id', () => {
    fc.assert(
      fc.property(fc.nat(), () => {
        // Arrange
        const expectedSimnetChainId = 2147483648;

        // Act
        const actual = chainId(simnet);

        // Expect
        expect(actual).toEqual(expectedSimnetChainId);
      })
    );
  });
  it('contract-caller', () => {
    fc.assert(
      fc.property(fc.nat(), () => {
        // Act
        const actual = contractCaller(simnet);

        // Expect
        expect(actual).toEqual(deployer);
      })
    );
  });

  it('stx-liquid-supply', () => {
    fc.assert(
      fc.property(fc.nat(), () => {
        // Arrange
        const expected = 1_000_000_000_000_000;

        // Act
        const actual = stxLiquidSupply(simnet);

        // Expect
        expect(actual).toEqual(expected);
      })
    );
  });

  it('stx-account', () => {
    fc.assert(
      fc.property(fc.constantFrom(...stxAddresses), (addr) => {
        // Arrange
        const expected = {
          locked: 0,
          'unlock-height': 0,
          unlocked: 100_000_000_000_000,
        };

        // Act
        const actual = stxAccount(simnet, addr);

        // Expect
        expect(actual).toEqual(expected);
      })
    );
  });

  it('getMapEntry, principal as key, return contains: tuple, list, uint, none, buffer', () => {
    const simnetStacks = new StacksDevnet();
    const stackingClient = new StackingClient(deployer, simnetStacks);
    const privKey = createStacksPrivateKey(
      '753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601'
    );
    const pubKey = getPublicKeyFromPrivate(privKey.data);
    const signerSig = stackingClient.signPoxSignature({
      // The signer key being authorized.
      signerPrivateKey: privKey,
      // The reward cycle for which the authorization is valid.
      // For stack-stx and stack-extend, this refers to the reward cycle
      // where the transaction is confirmed. For stack-aggregation-commit,
      // this refers to the reward cycle argument in that function.
      rewardCycle: currentRewardCycleJS(simnet, deployer),
      // For stack-stx, this refers to lock-period. For stack-extend,
      // this refers to extend-count. For stack-aggregation-commit, this is
      // u1.
      period: 2,
      // A string representing the function where this authorization is valid.
      // Either stack-stx, stack-extend, stack-increase or agg-commit.
      topic: Pox4SignatureTopic.StackStx,
      // The PoX address that can be used with this signer key.
      poxAddress: 'mqVnk6NPRdhntvfm4hh9vvjiRkFDUuSYsH',
      // The unique auth-id for this authorization.
      authId: 0,
      // The maximum amount of uSTX that can be used (per tx) with this signer
      // key.
      maxAmount: 10_000_000_000_000,
    });
    simnet.callPublicFn(
      pox4,
      'stack-stx',
      [
        Cl.uint(1_000_000_000_000),
        poxAddressToTuple('mqVnk6NPRdhntvfm4hh9vvjiRkFDUuSYsH'),
        Cl.uint(burnBlockHeight(simnet)),
        Cl.uint(2),
        Cl.some(Cl.bufferFromHex(signerSig)),
        Cl.bufferFromHex(pubKey),
        Cl.uint(10_000_000_000_000),
        Cl.uint(0),
      ],
      stxAddresses[2]
    );

    const mapKey = Cl.tuple({
      stacker: Cl.principal(stxAddresses[2]),
    });

    console.log(getMapEntry(simnet, pox4, 'stacking-state', mapKey));
  });

  it('getMapEntry, principal as key, return contains: some, principal, uint, buffer, tuple', () => {
    simnet.callPublicFn(
      pox4,
      'delegate-stx',
      [
        Cl.uint(1_000_000_000_000),
        Cl.principal(stxAddresses[1]),
        Cl.some(Cl.uint(10000)),
        Cl.some(poxAddressToTuple('mqVnk6NPRdhntvfm4hh9vvjiRkFDUuSYsH')),
      ],
      deployer
    );
    const mapKey = Cl.tuple({ stacker: Cl.principal(deployer) });

    console.log(getMapEntry(simnet, pox4, 'delegation-state', mapKey));
  });

  it('getMapEntry, tuple as key, return contains: int', () => {
    simnet.callPublicFn(
      pox4,
      'delegate-stx',
      [
        Cl.uint(1_000_000_000_000),
        Cl.principal(stxAddresses[1]),
        Cl.none(),
        Cl.some(poxAddressToTuple('mqVnk6NPRdhntvfm4hh9vvjiRkFDUuSYsH')),
      ],
      deployer
    );
    simnet.callPublicFn(
      pox4,
      'delegate-stack-stx',
      [
        Cl.principal(deployer),
        Cl.uint(999_000_000_000),
        poxAddressToTuple('mqVnk6NPRdhntvfm4hh9vvjiRkFDUuSYsH'),
        Cl.uint(burnBlockHeight(simnet)),
        Cl.uint(1),
      ],
      stxAddresses[1]
    );

    const mapKey = Cl.tuple({
      'pox-addr': poxAddressToTuple('mqVnk6NPRdhntvfm4hh9vvjiRkFDUuSYsH'),
      'reward-cycle': Cl.uint(currentRewardCycleJS(simnet, deployer) + 1),
      sender: Cl.principal(stxAddresses[1]),
    });

    console.log(getMapEntry(simnet, pox4, 'partial-stacked-by-cycle', mapKey));
  });

  it('getDataVar list', () => {
    simnet.callPublicFn(
      testContract,
      'set-list',
      [
        Cl.list([
          Cl.tuple({
            signer: Cl.principal(stxAddresses[0]),
            'num-slots': Cl.uint(2),
          }),
          Cl.tuple({
            signer: Cl.principal(stxAddresses[1]),
            'num-slots': Cl.uint(4),
          }),
          Cl.tuple({
            signer: Cl.principal(stxAddresses[3]),
            'num-slots': Cl.uint(6),
          }),
          Cl.tuple({
            signer: Cl.principal(stxAddresses[4]),
            'num-slots': Cl.uint(3),
          }),
        ]),
      ],
      deployer
    );

    console.log(getDataVar(simnet, testContract, 'test-list'));
  });

  it('getDataVar true', () => {
    console.log(getDataVar(simnet, testContract, 'test-bool-true'));
  });

  it('getDataVar string ascii', () => {
    console.log(getDataVar(simnet, testContract, 'test-string-ascii'));
  });

  it('getDataVar string UTF8', () => {
    console.log(getDataVar(simnet, testContract, 'test-string-utf8'));
  });

  it('getDataVar ok', () => {
    console.log(getDataVar(simnet, testContract, 'test-response-ok'));
  });

  it('getDataVar err', () => {
    console.log(getDataVar(simnet, testContract, 'test-response-err'));
  });

  it('getDataVar principal', () => {
    console.log(getDataVar(simnet, testContract, 'test-principal'));
  });

  it('getDataVar Int', () => {
    console.log(getDataVar(simnet, testContract, 'test-int'));
  });
});
