import { Simnet } from '@hirosystems/clarinet-sdk';
import { Cl, cvToValue } from '@stacks/transactions';

const contract = 'ST000000000000000000002AMW42H.signers-voting';

/**
 * Returns true if the provided height is a prepare phase block.
 *
 * @param network - The Simnet instance to query.
 * @param caller - The address of the caller making the read-only function call.
 * @param height - The block height to check.
 * @returns A boolean indicating whether the provided height is a prepare phase block.
 */
export function isInPreparePhaseMock(
  network: Simnet,
  caller: string,
  height: number
): boolean {
  const { result: actual } = network.callReadOnlyFn(
    contract,
    'is-in-prepare-phase',
    [Cl.uint(height)],
    caller
  );
  return cvToValue(actual);
}
