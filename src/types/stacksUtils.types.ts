export interface StxAccountDetails {
  [key: string]: number;
}

export interface MapEntry {
  [key: string]: number | string | boolean | null | MapEntry | MapEntry[];
}

export interface DataVar {
  [key: string]: number | string | boolean | null | DataVar | DataVar[];
}

export type DataVarValue = DataVar;
export type MapEntryValue = MapEntry;
