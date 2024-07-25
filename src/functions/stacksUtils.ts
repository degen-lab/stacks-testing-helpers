import { Simnet } from '@hirosystems/clarinet-sdk';
import {
  ClarityType,
  ClarityValue,
  cvToValue,
  cvToJSON,
  TupleCV,
  SomeCV,
} from '@stacks/transactions';

import {
  StxAccountDetails,
  DataVarValue,
  MapEntryValue,
} from '../types/stacksUtils.types';

/**
 * Returns the current burn block height for a given Simnet instance.
 *
 * This function queries the Simnet instance to retrieve the current burn block height.
 *
 * @param network - The Simnet instance to query.
 * @returns The current burn block height as a number.
 */
export function burnBlockHeight(network: Simnet): number {
  const burnHeight = Number(
    cvToValue(network.runSnippet('burn-block-height') as ClarityValue)
  );
  return burnHeight;
}

/**
 * Returns the chain ID for a given Simnet instance.
 *
 * This function queries the Simnet instance to retrieve the chain ID.
 *
 * @param network - The Simnet instance to query.
 * @returns The chain ID as a number.
 */
export function chainId(network: Simnet): number {
  const chainId = Number(
    cvToValue(network.runSnippet('chain-id') as ClarityValue)
  );
  return chainId;
}

/**
 * Returns the contract caller for a given Simnet instance.
 *
 * This function queries the Simnet instance to retrieve the contract caller.
 *
 * @param network - The Simnet instance to query.
 * @returns The contract caller.
 */
export function contractCaller(network: Simnet): string {
  const contractCaller = cvToValue(
    network.runSnippet('contract-caller') as ClarityValue
  );
  return contractCaller;
}

/**
 * Returns the liquid supply of STX (Stacks tokens) for a given Simnet instance.
 *
 * This function queries the Simnet instance to retrieve the current liquid supply of STX.
 *
 * @param network - The Simnet instance to query.
 * @returns The liquid supply of STX as a number.
 */
export function stxLiquidSupply(network: Simnet): number {
  const liquidSupply = Number(
    cvToValue(network.runSnippet('stx-liquid-supply') as ClarityValue)
  );
  return liquidSupply;
}

/**
 * Returns the details of a given STX account for a given Simnet instance.
 *
 * This function queries the Simnet instance to retrieve the details of the specified STX account.
 *
 * @param network - The Simnet instance to query.
 * @param address - The address of the STX account.
 * @returns An object containing details of the STX account, with keys as string and values as numbers.
 */
export function stxAccount(
  network: Simnet,
  address: string
): StxAccountDetails {
  const stxAccount = cvToValue(
    network.runSnippet(`(stx-account '${address})`) as ClarityValue
  );
  let newStxAccount: { [key: string]: number } = {};
  for (let key in stxAccount) {
    if (stxAccount.hasOwnProperty(key)) {
      newStxAccount[key] = parseInt(stxAccount[key].value, 10);
    }
  }
  return newStxAccount;
}

function extractValue(value: ClarityValue): any {
  switch (value.type) {
    case ClarityType.UInt:
      return Number(value.value);

    case ClarityType.Int:
      return Number(value.value);

    case ClarityType.PrincipalStandard:
      return cvToJSON(value).value;

    case ClarityType.OptionalSome:
      return extractValue(value.value);

    case ClarityType.OptionalNone:
      return null;

    case ClarityType.Buffer:
      return '0x' + Buffer.from(value.buffer).toString('hex');

    case ClarityType.Tuple:
      const extractedTuple: { [key: string]: any } = {};
      for (const [k, v] of Object.entries(value.data)) {
        extractedTuple[k] = extractValue(v);
      }
      return extractedTuple;

    case ClarityType.List:
      return value.list.map(extractValue);

    case ClarityType.BoolTrue:
      return true;

    case ClarityType.BoolFalse:
      return false;

    case ClarityType.StringASCII:
      return value.data;

    case ClarityType.StringUTF8:
      return value.data;

    case ClarityType.ResponseOk:
      return extractValue(value.value);

    case ClarityType.ResponseErr:
      return extractValue(value.value);

    case ClarityType.PrincipalContract:
      return cvToJSON(value).value;

    default:
      return null;
  }
}

/**
 * Returns the value of a data variable from a contract on the given Simnet instance.
 *
 * This function queries the Simnet instance to retrieve the value of a specific data variable
 * from the specified contract.
 *
 * @param network - The Simnet instance to query.
 * @param contractName - The name of the contract containing the data variable.
 * @param variableName - The name of the data variable whose value is to be retrieved.
 * @returns The value of the specified data variable.
 */
export function getDataVar(
  network: Simnet,
  contractName: string,
  variableName: string
): DataVarValue {
  const variable = network.getDataVar(contractName, variableName);
  const value = extractValue(variable);
  return value;
}

/**
 * Returns a map entry from a specified map within a contract on the given Simnet instance.
 *
 * This function queries the Simnet instance to retrieve the entry of a specific map, identified by its name and key,
 * from the specified contract.
 *
 * @param network - The Simnet instance to query.
 * @param contractName - The name of the contract containing the map.
 * @param mapName - The name of the map within the contract.
 * @param mapKey - The key of the map entry to retrieve as ClarityValue.
 * @returns An object representing the map entry, with keys as string and values as numbers, addresses, or null.
 */
export function getMapEntry(
  network: Simnet,
  contractName: string,
  mapName: string,
  mapKey: ClarityValue
): MapEntryValue {
  const map = (
    (network.getMapEntry(contractName, mapName, mapKey) as SomeCV)
      .value as TupleCV
  ).data;
  let newMap: { [key: string]: number | string | null } = {};

  for (let key in map) {
    if (map.hasOwnProperty(key)) {
      newMap[key] = extractValue(map[key]);
    }
  }
  return newMap;
}
