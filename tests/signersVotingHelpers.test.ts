import { initSimnet } from '@hirosystems/clarinet-sdk';
import { it, describe, expect } from 'vitest';
import { isInPreparePhaseJS } from '../src/functions/signersVotingHelpers';
import {
  PREPARE_CYCLE_LENGTH,
  REWARD_CYCLE_LENGTH,
} from './testHelpers/testConstants';
import fc from 'fast-check';
import { getDataVar } from '../src/functions/stacksUtils';

const simnet = await initSimnet();
const contractPox = 'ST000000000000000000002AMW42H.pox-4';
const deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

describe('test signersVotingHelpers functions', async () => {
  it('is-in-prepare-phase false', () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.nat(REWARD_CYCLE_LENGTH - PREPARE_CYCLE_LENGTH - 1),
        (cycle, rngBlocks) => {
          const firstBurnchainBlockHt = getDataVar(
            simnet,
            contractPox,
            'first-burnchain-block-height'
          ) as unknown as number;
          const expected = false;
          const height =
            firstBurnchainBlockHt + cycle * REWARD_CYCLE_LENGTH + rngBlocks;
          const actual = isInPreparePhaseJS(simnet, deployer, height);
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('is-in-prepare-phase true', () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.integer({
          min: REWARD_CYCLE_LENGTH - PREPARE_CYCLE_LENGTH,
          max: REWARD_CYCLE_LENGTH - 1,
        }),
        (cycle, rngBlocks) => {
          const firstBurnchainBlockHt = getDataVar(
            simnet,
            contractPox,
            'first-burnchain-block-height'
          ) as unknown as number;
          const expected = true;
          const height =
            firstBurnchainBlockHt + cycle * REWARD_CYCLE_LENGTH + rngBlocks;
          const actual = isInPreparePhaseJS(simnet, deployer, height);
          expect(actual).toEqual(expected);
        }
      )
    );
  });
});
