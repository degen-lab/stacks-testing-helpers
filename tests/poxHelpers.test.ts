import { beforeAll, describe, expect, it } from 'vitest';
import {
  blocksUntilPreparePhaseJS,
  blocksUntilRewardPhaseJS,
  burnHeightToRewardCycleJS,
  currentRewardCycleJS,
  customBlocksUntilPreparePhaseJS,
  customBlocksUntilRewardPhaseJS,
  getPoxInfoJS,
  getStackingMinimumJS,
  rewardCycleToBurnHeightJS,
} from '../src/functions/poxHelpers';
import { Simnet, initSimnet } from '@hirosystems/clarinet-sdk';
import fc from 'fast-check';
import {
  PREPARE_CYCLE_LENGTH,
  REWARD_CYCLE_LENGTH,
} from './testHelpers/testConstants';
import { burnBlockHeight, getDataVar } from '../src/functions/stacksUtils';

const deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
let simnet: Simnet;
const contract = 'ST000000000000000000002AMW42H.pox-4';

describe('test poxHelpers functions', async () => {
  beforeAll(async () => {
    simnet = await initSimnet();
  });

  it('blocks-until-reward-phase, simnet is in reward phase', () => {
    fc.assert(
      fc.property(fc.nat(2500), (nrBlocks) => {
        // Arrange
        const expected = 0;
        simnet.mineEmptyBlocks(nrBlocks);
        const toRewardPhase =
          simnet.blockHeight % REWARD_CYCLE_LENGTH >=
          REWARD_CYCLE_LENGTH - PREPARE_CYCLE_LENGTH
            ? PREPARE_CYCLE_LENGTH
            : 0;
        simnet.mineEmptyBlocks(toRewardPhase);

        // Act
        const actual = blocksUntilRewardPhaseJS(simnet);

        // Expect
        expect(actual).toEqual(expected);
      })
    );
  });

  it('blocks-until-reward-phase, simnet is in prepare phase', () => {
    fc.assert(
      fc.property(fc.nat(2500), (nrBlocks) => {
        // Arrange
        simnet.mineEmptyBlocks(nrBlocks);
        const toPreparePhase =
          simnet.blockHeight % REWARD_CYCLE_LENGTH <
          REWARD_CYCLE_LENGTH - PREPARE_CYCLE_LENGTH
            ? REWARD_CYCLE_LENGTH -
              PREPARE_CYCLE_LENGTH -
              (simnet.blockHeight % REWARD_CYCLE_LENGTH)
            : 0;
        simnet.mineEmptyBlocks(toPreparePhase);
        const expected = 1050 - (simnet.blockHeight % 1050);

        // Act
        const actual = blocksUntilRewardPhaseJS(simnet);

        // Expect
        expect(actual).toEqual(expected);
      })
    );
  });

  it('blocks-until-prepare-phase, simnet is in prepare phase', () => {
    fc.assert(
      fc.property(fc.nat(2500), (nrBlocks) => {
        // Arrange
        const expected = 0;
        simnet.mineEmptyBlocks(nrBlocks);
        const toPreparePhase =
          simnet.blockHeight % REWARD_CYCLE_LENGTH <
          REWARD_CYCLE_LENGTH - PREPARE_CYCLE_LENGTH
            ? REWARD_CYCLE_LENGTH -
              PREPARE_CYCLE_LENGTH -
              (simnet.blockHeight % REWARD_CYCLE_LENGTH)
            : 0;
        simnet.mineEmptyBlocks(toPreparePhase);

        // Act
        const actual = blocksUntilPreparePhaseJS(simnet);

        // Expect
        expect(actual).toEqual(expected);
      })
    );
  });

  it('blocks-until-prepare-phase, simnet is in reward phase', () => {
    fc.assert(
      fc.property(fc.nat(2500), (nrBlocks) => {
        // Arrange
        simnet.mineEmptyBlocks(nrBlocks);
        const toRewardPhase =
          simnet.blockHeight % REWARD_CYCLE_LENGTH >=
          REWARD_CYCLE_LENGTH - PREPARE_CYCLE_LENGTH
            ? PREPARE_CYCLE_LENGTH
            : 0;
        simnet.mineEmptyBlocks(toRewardPhase);
        const expected =
          REWARD_CYCLE_LENGTH -
          PREPARE_CYCLE_LENGTH -
          (simnet.blockHeight % REWARD_CYCLE_LENGTH);

        // Act
        const actual = blocksUntilPreparePhaseJS(simnet);

        // Expect
        expect(actual).toEqual(expected);
      })
    );
  });

  it('custom blocks-until-reward-phase, is in reward phase, reward-cycle-length, prepare-cycle-length, start-burn-height provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            rewardCycleLength: fc.nat(10000),
            prepareCycleLength: fc.nat(1000),
            startBurnHt: fc.nat(10000),
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ rewardCycleLength, prepareCycleLength, startBurnHt, height }) =>
              (height - startBurnHt) % rewardCycleLength <
              rewardCycleLength - prepareCycleLength
          )
          .map(
            ({
              rewardCycleLength,
              prepareCycleLength,
              startBurnHt,
              height,
            }) => ({
              burnBlockHt: height,
              rewardCycleLength,
              prepareCycleLength,
              startBurnHt,
            })
          ),
        ({
          burnBlockHt,
          rewardCycleLength,
          prepareCycleLength,
          startBurnHt,
        }) => {
          // Arrange
          const expected = 0;

          // Act
          const actual = customBlocksUntilRewardPhaseJS(
            burnBlockHt,
            rewardCycleLength,
            prepareCycleLength,
            startBurnHt
          );

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-reward-phase, is in reward phase, reward-cycle-length, prepare-cycle-length provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            rewardCycleLength: fc.nat(10000),
            prepareCycleLength: fc.nat(1000),
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ rewardCycleLength, prepareCycleLength, height }) =>
              (height - 0) % rewardCycleLength <
              rewardCycleLength - prepareCycleLength
          )
          .map(({ rewardCycleLength, prepareCycleLength, height }) => ({
            burnBlockHt: height,
            rewardCycleLength,
            prepareCycleLength,
          })),
        ({ burnBlockHt, rewardCycleLength, prepareCycleLength }) => {
          // Arrange
          const expected = 0;

          // Act
          const actual = customBlocksUntilRewardPhaseJS(
            burnBlockHt,
            rewardCycleLength,
            prepareCycleLength
          );

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-reward-phase, is in reward phase, reward-cycle-length provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            rewardCycleLength: fc.nat(10000),
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ rewardCycleLength, height }) =>
              (height - 0) % rewardCycleLength <
              rewardCycleLength - PREPARE_CYCLE_LENGTH
          )
          .map(({ rewardCycleLength, height }) => ({
            burnBlockHt: height,
            rewardCycleLength,
          })),
        ({ burnBlockHt, rewardCycleLength }) => {
          // Arrange
          const expected = 0;

          // Act
          const actual = customBlocksUntilRewardPhaseJS(
            burnBlockHt,
            rewardCycleLength
          );

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-reward-phase, is in reward phase, no parameters provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ height }) =>
              (height - 0) % REWARD_CYCLE_LENGTH <
              REWARD_CYCLE_LENGTH - PREPARE_CYCLE_LENGTH
          )
          .map(({ height }) => ({
            burnBlockHt: height,
          })),
        ({ burnBlockHt }) => {
          // Arrange
          const expected = 0;

          // Act
          const actual = customBlocksUntilRewardPhaseJS(burnBlockHt);

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-reward-phase, is in prepare phase, reward-cycle-length, prepare-cycle-length, start-burn-height provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            rewardCycleLength: fc.nat(10000),
            prepareCycleLength: fc.nat(1000),
            startBurnHt: fc.nat(10000),
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ rewardCycleLength, prepareCycleLength, startBurnHt, height }) =>
              (height - startBurnHt) % rewardCycleLength >=
              rewardCycleLength - prepareCycleLength
          )
          .map(
            ({
              rewardCycleLength,
              prepareCycleLength,
              startBurnHt,
              height,
            }) => ({
              burnBlockHt: height,
              rewardCycleLength,
              prepareCycleLength,
              startBurnHt,
            })
          ),
        ({
          burnBlockHt,
          rewardCycleLength,
          prepareCycleLength,
          startBurnHt,
        }) => {
          // Arrange
          const expected =
            rewardCycleLength -
            ((burnBlockHt - startBurnHt) % rewardCycleLength);

          // Act
          const actual = customBlocksUntilRewardPhaseJS(
            burnBlockHt,
            rewardCycleLength,
            prepareCycleLength,
            startBurnHt
          );

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-reward-phase, is in prepare phase, reward-cycle-length, prepare-cycle-length provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            rewardCycleLength: fc.nat(10000),
            prepareCycleLength: fc.nat(1000),
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ rewardCycleLength, prepareCycleLength, height }) =>
              (height - 0) % rewardCycleLength >=
              rewardCycleLength - prepareCycleLength
          )
          .map(({ rewardCycleLength, prepareCycleLength, height }) => ({
            burnBlockHt: height,
            rewardCycleLength,
            prepareCycleLength,
          })),
        ({ burnBlockHt, rewardCycleLength, prepareCycleLength }) => {
          // Arrange
          const expected =
            rewardCycleLength - ((burnBlockHt - 0) % rewardCycleLength);

          // Act
          const actual = customBlocksUntilRewardPhaseJS(
            burnBlockHt,
            rewardCycleLength,
            prepareCycleLength
          );

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-reward-phase, is in prepare phase, reward-cycle-length provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            rewardCycleLength: fc.nat(10000),
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ rewardCycleLength, height }) =>
              (height - 0) % rewardCycleLength >=
              rewardCycleLength - PREPARE_CYCLE_LENGTH
          )
          .map(({ rewardCycleLength, height }) => ({
            burnBlockHt: height,
            rewardCycleLength,
          })),
        ({ burnBlockHt, rewardCycleLength }) => {
          // Arrange
          const expected =
            rewardCycleLength - ((burnBlockHt - 0) % rewardCycleLength);

          // Act
          const actual = customBlocksUntilRewardPhaseJS(
            burnBlockHt,
            rewardCycleLength
          );

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-reward-phase, is in prepare phase, no parameters provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ height }) =>
              (height - 0) % REWARD_CYCLE_LENGTH >=
              REWARD_CYCLE_LENGTH - PREPARE_CYCLE_LENGTH
          )
          .map(({ height }) => ({
            burnBlockHt: height,
          })),
        ({ burnBlockHt }) => {
          // Arrange
          const expected =
            REWARD_CYCLE_LENGTH - ((burnBlockHt - 0) % REWARD_CYCLE_LENGTH);

          // Act
          const actual = customBlocksUntilRewardPhaseJS(burnBlockHt);

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-prepare-phase, is in prepare phase, reward-cycle-length, prepare-cycle-length, start-burn-height provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            rewardCycleLength: fc.nat(10000),
            prepareCycleLength: fc.nat(1000),
            startBurnHt: fc.nat(10000),
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ rewardCycleLength, prepareCycleLength, startBurnHt, height }) =>
              (height - startBurnHt) % rewardCycleLength >=
              rewardCycleLength - prepareCycleLength
          )
          .map(
            ({
              rewardCycleLength,
              prepareCycleLength,
              startBurnHt,
              height,
            }) => ({
              burnBlockHt: height,
              rewardCycleLength,
              prepareCycleLength,
              startBurnHt,
            })
          ),
        ({
          burnBlockHt,
          rewardCycleLength,
          prepareCycleLength,
          startBurnHt,
        }) => {
          // Arrange
          const expected = 0;

          // Act
          const actual = customBlocksUntilPreparePhaseJS(
            burnBlockHt,
            rewardCycleLength,
            prepareCycleLength,
            startBurnHt
          );

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-prepare-phase, is in prepare phase, reward-cycle-length, prepare-cycle-length provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            rewardCycleLength: fc.nat(10000),
            prepareCycleLength: fc.nat(1000),
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ rewardCycleLength, prepareCycleLength, height }) =>
              (height - 0) % rewardCycleLength >=
              rewardCycleLength - prepareCycleLength
          )
          .map(({ rewardCycleLength, prepareCycleLength, height }) => ({
            burnBlockHt: height,
            rewardCycleLength,
            prepareCycleLength,
          })),
        ({ burnBlockHt, rewardCycleLength, prepareCycleLength }) => {
          // Arrange
          const expected = 0;

          // Act
          const actual = customBlocksUntilPreparePhaseJS(
            burnBlockHt,
            rewardCycleLength,
            prepareCycleLength
          );

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-prepare-phase, is in prepare phase, reward-cycle-length provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            rewardCycleLength: fc.nat(10000),
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ rewardCycleLength, height }) =>
              (height - 0) % rewardCycleLength >=
              rewardCycleLength - PREPARE_CYCLE_LENGTH
          )
          .map(({ rewardCycleLength, height }) => ({
            burnBlockHt: height,
            rewardCycleLength,
          })),
        ({ burnBlockHt, rewardCycleLength }) => {
          // Arrange
          const expected = 0;

          // Act
          const actual = customBlocksUntilPreparePhaseJS(
            burnBlockHt,
            rewardCycleLength
          );

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-prepare-phase, is in prepare phase, no parameters provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ height }) =>
              (height - 0) % REWARD_CYCLE_LENGTH >=
              REWARD_CYCLE_LENGTH - PREPARE_CYCLE_LENGTH
          )
          .map(({ height }) => ({
            burnBlockHt: height,
          })),
        ({ burnBlockHt }) => {
          // Arrange
          const expected = 0;

          // Act
          const actual = customBlocksUntilPreparePhaseJS(burnBlockHt);

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-prepare-phase, is in reward phase, reward-cycle-length, prepare-cycle-length, start-burn-height provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            rewardCycleLength: fc.nat(10000),
            prepareCycleLength: fc.nat(1000),
            startBurnHt: fc.nat(10000),
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ rewardCycleLength, prepareCycleLength, startBurnHt, height }) =>
              (height - startBurnHt) % rewardCycleLength <
              rewardCycleLength - prepareCycleLength
          )
          .map(
            ({
              rewardCycleLength,
              prepareCycleLength,
              startBurnHt,
              height,
            }) => ({
              burnBlockHt: height,
              rewardCycleLength,
              prepareCycleLength,
              startBurnHt,
            })
          ),
        ({
          burnBlockHt,
          rewardCycleLength,
          prepareCycleLength,
          startBurnHt,
        }) => {
          // Arrange
          const expected =
            rewardCycleLength -
            prepareCycleLength -
            ((burnBlockHt - startBurnHt) % rewardCycleLength);

          // Act
          const actual = customBlocksUntilPreparePhaseJS(
            burnBlockHt,
            rewardCycleLength,
            prepareCycleLength,
            startBurnHt
          );

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-prepare-phase, is in reward phase, reward-cycle-length, prepare-cycle-length provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            rewardCycleLength: fc.nat(10000),
            prepareCycleLength: fc.nat(1000),
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ rewardCycleLength, prepareCycleLength, height }) =>
              (height - 0) % rewardCycleLength <
              rewardCycleLength - prepareCycleLength
          )
          .map(({ rewardCycleLength, prepareCycleLength, height }) => ({
            burnBlockHt: height,
            rewardCycleLength,
            prepareCycleLength,
          })),
        ({ burnBlockHt, rewardCycleLength, prepareCycleLength }) => {
          // Arrange
          const expected =
            rewardCycleLength -
            prepareCycleLength -
            (burnBlockHt % rewardCycleLength);

          // Act
          const actual = customBlocksUntilPreparePhaseJS(
            burnBlockHt,
            rewardCycleLength,
            prepareCycleLength
          );

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-prepare-phase, is in reward phase, reward-cycle-length provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            rewardCycleLength: fc.nat(10000),
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ rewardCycleLength, height }) =>
              (height - 0) % rewardCycleLength <
              rewardCycleLength - PREPARE_CYCLE_LENGTH
          )
          .map(({ rewardCycleLength, height }) => ({
            burnBlockHt: height,
            rewardCycleLength,
          })),
        ({ burnBlockHt, rewardCycleLength }) => {
          // Arrange
          const expected =
            rewardCycleLength -
            PREPARE_CYCLE_LENGTH -
            (burnBlockHt % rewardCycleLength);

          // Act
          const actual = customBlocksUntilPreparePhaseJS(
            burnBlockHt,
            rewardCycleLength
          );

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('custom blocks-until-prepare-phase, is in reward phase, no parameters provided', () => {
    fc.assert(
      fc.property(
        fc
          .record({
            height: fc.integer({ min: 10000, max: 10000000 }),
          })
          .filter(
            ({ height }) =>
              (height - 0) % REWARD_CYCLE_LENGTH <
              REWARD_CYCLE_LENGTH - PREPARE_CYCLE_LENGTH
          )
          .map(({ height }) => ({
            burnBlockHt: height,
          })),
        ({ burnBlockHt }) => {
          // Arrange
          const expected =
            REWARD_CYCLE_LENGTH -
            PREPARE_CYCLE_LENGTH -
            (burnBlockHt % REWARD_CYCLE_LENGTH);

          // Act
          const actual = customBlocksUntilPreparePhaseJS(burnBlockHt);

          // Expect
          expect(actual).toEqual(expected);
        }
      )
    );
  });

  it('current-pox-reward-cycle', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1000 }), (nrBlocks) => {
        // Arrange
        simnet.mineEmptyBlocks(nrBlocks);
        const burnHeight = burnBlockHeight(simnet);

        const expected = Math.floor(
          (burnHeight -
            (getDataVar(
              simnet,
              contract,
              'first-burnchain-block-height'
            ) as unknown as number)) /
            REWARD_CYCLE_LENGTH
        );

        // Act
        const actual = currentRewardCycleJS(simnet, deployer);

        // Expect
        expect(actual).toEqual(expected);
      })
    );
  });

  it('burn-height-to-reward-cycle', () => {
    fc.assert(
      fc.property(fc.nat(), (height) => {
        // Arrange
        const expected = Math.floor(
          (height -
            (getDataVar(
              simnet,
              contract,
              'first-burnchain-block-height'
            ) as unknown as number)) /
            REWARD_CYCLE_LENGTH
        );

        // Act
        const actual = burnHeightToRewardCycleJS(simnet, deployer, height);

        // Expect
        expect(actual).toEqual(expected);
      })
    );
  });

  it('reward-cycle-to-burn-height', () => {
    fc.assert(
      fc.property(fc.nat(), (rewCycle) => {
        // Arrange
        const expected = rewCycle * REWARD_CYCLE_LENGTH;

        // Act
        const actual = rewardCycleToBurnHeightJS(simnet, deployer, rewCycle);

        // Expect
        expect(actual).toEqual(expected);
      })
    );
  });

  it('get-pox-info', async () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1000 }), (nrBlocks) => {
        // Arrange
        simnet.mineEmptyBlocks(nrBlocks);
        const burnHeight = burnBlockHeight(simnet);
        const cycleId = Math.floor(
          (burnHeight -
            (getDataVar(
              simnet,
              contract,
              'first-burnchain-block-height'
            ) as unknown as number)) /
            REWARD_CYCLE_LENGTH
        );
        const expected = {
          'first-burnchain-block-height': 0,
          'min-amount-ustx': 125000000000,
          'prepare-cycle-length': 50,
          'reward-cycle-id': cycleId,
          'reward-cycle-length': 1050,
          'total-liquid-supply-ustx': 1000000000000000,
        };

        // Act
        const actual = getPoxInfoJS(simnet, deployer);

        // Expect
        expect(actual).toEqual(expected);
      })
    );
  });

  it('get-stacking-minimum', () => {
    fc.assert(
      fc.property(fc.nat(), () => {
        // Arrange
        const expected = BigInt(125000000000);

        // Act
        const actual = getStackingMinimumJS(simnet, deployer);

        // Expect
        expect(actual).toEqual(expected);
      })
    );
  });
});
