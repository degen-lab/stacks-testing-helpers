export type PoxInfo = {
  'first-burnchain-block-height': number;
  'min-amount-ustx': number;
  'prepare-cycle-length': number;
  'reward-cycle-id': number;
  'reward-cycle-length': number;
  'total-liquid-supply-ustx': number;
};

export type PoxInfoKey = keyof PoxInfo;
