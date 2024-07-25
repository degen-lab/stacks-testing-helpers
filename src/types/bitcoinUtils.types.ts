export type StacksNetwork = 'mainnet' | 'testnet' | 'devnet' | 'mocknet';

export type AddressType = 'p2pkh' | 'p2sh' | 'p2wpkh' | 'p2wsh' | 'p2tr';

export enum Network {
  mainnet = 'mainnet',
  testnet = 'testnet',
  regtest = 'regtest',
}

export enum versions {
  p2pkh = '00',
  p2sh = '01',
  p2shp2wpkh = '02',
  p2shp2wsh = '03',
  p2wpkh = '04',
  p2wsh = '05',
  p2tr = '06',
}
