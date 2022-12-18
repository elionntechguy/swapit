export type token = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

export interface swapToken extends token {
  amount: number;
}
