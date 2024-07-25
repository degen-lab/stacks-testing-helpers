import { Simnet } from '@hirosystems/clarinet-sdk';
import { Cl, cvToJSON, cvToValue } from '@stacks/transactions';
import {
  DEFAULT_TESTNET_PREPARE_CYCLE_LENGTH,
  DEFAULT_TESTNET_REWARD_CYCLE_LENGTH,
} from '../helpers/constants';
import { PoxInfo, PoxInfoKey } from '../types/poxHelpers.types';
import { getDataVar } from './stacksUtils';

const pox4 = 'ST000000000000000000002AMW42H.pox-4';

/**
 * Returns the current stacking reward cycle for a given Simnet instance at a
 * certain moment.
 *
 * @param network - The Simnet instance to query.
 * @param caller - The address of the caller making the read-only function call.
 * @returns The current stacking reward cycle.
 */
export function currentRewardCycleMock(
  network: Simnet,
  caller: string
): number {
  const { result: actual } = network.callReadOnlyFn(
    pox4,
    'current-pox-reward-cycle',
    [],
    caller
  );
  return Number(cvToValue(actual));
}

/**
 * Returns the reward cycle corresponding to the given burn height.
 *
 * @param network - The Simnet instance to query.
 * @param caller - The address of the caller making the read-only function call.
 * @param height - The burn height for which the reward cycle is calculated.
 * @returns The reward cycle corresponding to the given burn height.
 */
export function burnHeightToRewardCycleMock(
  network: Simnet,
  caller: string,
  height: number
): number {
  const { result: actual } = network.callReadOnlyFn(
    pox4,
    'burn-height-to-reward-cycle',
    [Cl.uint(height)],
    caller
  );
  return Number(cvToValue(actual));
}

/**
 * Returns the first burn block height of the selected reward cycle.
 *
 * @param network - The Simnet instance to query.
 * @param caller - The address of the caller making the read-only function call.
 * @param rewCycle - The reward cycle for which the first burn block height is
 * calculated.
 * @returns The first burn block height of the given reward cycle.
 */
export function rewardCycleToBurnHeightMock(
  network: Simnet,
  caller: string,
  rewCycle: number
): number {
  const { result: actual } = network.callReadOnlyFn(
    pox4,
    'reward-cycle-to-burn-height',
    [Cl.uint(rewCycle)],
    caller
  );
  return Number(cvToValue(actual));
}

/**
 * Returns an object containing the following fields:
 * - 'first-burnchain-block-height': The activation burn height of the PoX Contract.
 * - 'min-amount-ustx': The minimum amount of uSTX required for a stacking slot.
 * - 'prepare-cycle-length': The length of the preparation cycle (in burn blocks).
 * - 'reward-cycle-id': The identifier of the reward cycle.
 * - 'reward-cycle-length': The length of the reward cycle (in burn blocks).
 * - 'total-liquid-supply-ustx': The total liquid supply of uSTX.
 *
 * @param network - The Simnet instance.
 * @param caller - The address of the caller making the read-only function call.
 * @returns An object containing POX (Proof of Transfer) information.
 */
export function getPoxInfoMock(network: Simnet, caller: string): PoxInfo {
  const { result: actual } = network.callReadOnlyFn(
    pox4,
    'get-pox-info',
    [],
    caller
  );
  const poxInfo = cvToJSON(actual).value.value;
  let poxInfoNew: PoxInfo = {
    'first-burnchain-block-height': 0,
    'min-amount-ustx': 0,
    'prepare-cycle-length': 0,
    'reward-cycle-id': 0,
    'reward-cycle-length': 0,
    'total-liquid-supply-ustx': 0,
  };

  if (typeof poxInfo === 'object' && poxInfo !== null) {
    for (let key in poxInfo) {
      if (poxInfo.hasOwnProperty(key) && key in poxInfoNew) {
        poxInfoNew[key as PoxInfoKey] = parseInt(poxInfo[key].value, 10);
      }
    }
  }

  return poxInfoNew;
}

/**
 * Returns the minimum amount of uSTX required for a stacking slot.
 *
 * @param network - The Simnet instance to query.
 * @param caller - The address of the caller making the read-only function call.
 * @returns The minimum amount of uSTX required for a stacking slot.
 */
export function getStackingMinimumMock(
  network: Simnet,
  caller: string
): bigint {
  const { result: actual } = network.callReadOnlyFn(
    pox4,
    'get-stacking-minimum',
    [],
    caller
  );
  return cvToValue(actual);
}

/**
 * Returns the number of burn blocks remaining until the next reward phase begins for
 * a given Simnet instance at a certain moment.
 *
 * @param network - The Simnet instance to query.
 * @returns The number of burn blocks remaining until the reward phase starts. Returns
 * 0 if already in the reward phase.
 */
export function blocksUntilRewardPhase(network: Simnet): number {
  const height = network.blockHeight;
  const startBurnHt = Number(
    getDataVar(network, pox4, 'first-burnchain-block-height')
  );
  if (
    (height - startBurnHt) % DEFAULT_TESTNET_REWARD_CYCLE_LENGTH <
    DEFAULT_TESTNET_REWARD_CYCLE_LENGTH - DEFAULT_TESTNET_PREPARE_CYCLE_LENGTH
  ) {
    return 0;
  } else {
    return (
      DEFAULT_TESTNET_REWARD_CYCLE_LENGTH -
      (network.blockHeight % DEFAULT_TESTNET_REWARD_CYCLE_LENGTH)
    );
  }
}

/**
 * Customizable method that returns the number of burn blocks remaining until the
 * next reward phase begins.
 *
 * This function calculates the number of burn blocks remaining until the reward
 * phase starts, based on the current burn block height and the parameters defining
 * the reward cycle and prepare cycle.
 *
 * @param burnBlockHeight - The current burn height.
 * @param rewardCycleLength - The total number of blocks in one reward cycle (default
 * is 1050).
 * @param prepareCycleLength - The number of blocks designated for the prepare phase
 * within a reward cycle (default is 50).
 * @param startBurnHt - The starting burn chain height (default is 0).
 * @returns The number of burn blocks remaining until the reward phase starts. Returns
 * 0 if already in the reward phase.
 */
export function customBlocksUntilRewardPhase(
  burnBlockHeight: number,
  rewardCycleLength: number = 1050,
  prepareCycleLength: number = 50,
  startBurnHt: number = 0
): number {
  if (
    (burnBlockHeight - startBurnHt) % rewardCycleLength <
    rewardCycleLength - prepareCycleLength
  ) {
    return 0;
  } else {
    return (
      rewardCycleLength - ((burnBlockHeight - startBurnHt) % rewardCycleLength)
    );
  }
}

/**
 * Returns the number of burn blocks remaining until the prepare phase begins for a
 * given Simnet instance at a certain moment.
 *
 * @param network - The Simnet instance to query.
 * @returns The number of burn blocks remaining until the prepare phase starts. Returns
 * 0 if already in the prepare phase.
 */
export function blocksUntilPreparePhase(network: Simnet): number {
  const height = network.blockHeight;
  const startBurnHt = Number(
    getDataVar(network, pox4, 'first-burnchain-block-height')
  );
  if (
    (height - startBurnHt) % DEFAULT_TESTNET_REWARD_CYCLE_LENGTH >=
    DEFAULT_TESTNET_REWARD_CYCLE_LENGTH - DEFAULT_TESTNET_PREPARE_CYCLE_LENGTH
  ) {
    return 0;
  } else {
    return (
      DEFAULT_TESTNET_REWARD_CYCLE_LENGTH -
      DEFAULT_TESTNET_PREPARE_CYCLE_LENGTH -
      (network.blockHeight % DEFAULT_TESTNET_REWARD_CYCLE_LENGTH)
    );
  }
}

/**
 * Customizable method that returns the number of burn blocks remaining until the prepare
 * phase begins.
 *
 * This function calculates the number of burn blocks remaining until the prepare phase
 * starts, based on the current burn block height and the custom parameters defining the
 * reward cycle and prepare cycle lengths.
 *
 * @param burnBlockHeight - The current height of the burn chain block.
 * @param rewardCycleLength - The total number of blocks in one reward cycle (default is
 * 1050).
 * @param prepareCycleLength - The number of blocks designated for the prepare phase within
 * a reward cycle (default is 50).
 * @param startBurnHt - The starting burn chain height (default is 0).
 * @returns The number of burn blocks remaining until the prepare phase starts. Returns 0
 * if already in the prepare phase.
 */
export function customBlocksUntilPreparePhase(
  burnBlockHeight: number,
  rewardCycleLength: number = 1050,
  prepareCycleLength: number = 50,
  startBurnHt: number = 0
): number {
  if (
    (burnBlockHeight - startBurnHt) % rewardCycleLength >=
    rewardCycleLength - prepareCycleLength
  ) {
    return 0;
  } else {
    return (
      rewardCycleLength -
      prepareCycleLength -
      ((burnBlockHeight - startBurnHt) % rewardCycleLength)
    );
  }
}
