import { useEffect, useState } from 'react';

import qs from 'qs';

import { swapToken, token } from '../types';
import SwapModal from './Swap.modal';

interface ISwap {
  connectedWallet: string | null;
  connectWallet: void;
}

interface IOpen {
  type: string;
  state: boolean;
}

const Swap = ({ connectedWallet, connectWallet }: ISwap) => {
  const [openTokenModal, setOpenTokenModal] = useState<IOpen | null>(null);
  const [tokens, setTokens] = useState<token[]>([]);
  const [swapFrom, setSwapFrom] = useState<swapToken | null>(null);
  const [swapTo, setSwapTo] = useState<swapToken | null>(null);

  const [price, setPrice] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // Fetch tokens
      const getTokens = await fetch('/api/tokens');
      const tokenArr = await getTokens.json();
      setTokens(tokenArr);

      setSwapFrom({
        chainId: 1,
        address: '0x0000000000000000000000000000000000000000',
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        logoURI:
          'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
        amount: 0,
      });
    })();
  }, []);

  const getPrice = async () => {
    const params = {
      sellToken: swapFrom?.address,
      buyToken: swapTo?.address,
      sellAmount: swapFrom?.amount! * 10 ** swapFrom?.decimals!,
    };

    const priceReq = await fetch(
      `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`
    );
    const priceRes = await priceReq.json();

    console.log(priceRes);
  };

  return (
    <>
      <SwapModal
        open={openTokenModal}
        setOpen={setOpenTokenModal}
        tokens={tokens}
        swapFrom={swapFrom}
        setSwapFrom={setSwapFrom}
        swapTo={swapTo}
        setSwapTo={setSwapTo}
      />
      <div className="h-screen">
        <div className="w-full h-[95vh] flex flex-col justify-center items-center">
          <div className="w-96 h-[400px] border border-gray-200 shadow-md rounded-lg">
            <div className="p-6">
              <div className="flex flex-col w-full">
                <div className="text-3xl font-bold">SwapIt</div>
                <div className="text-sm py-1 font-light">
                  Making token swaps easy, fast, reliable.
                </div>
                <div className="flex flex-col w-full py-8 space-y-2">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                      <div className="text-lg font-bold">
                        <input
                          type="number"
                          className="placeholder:text-gray-500 !outline-none 
                          focus:border-b focus:border-black border-b border-transparent"
                          placeholder="0"
                          onChange={(e: any) => {
                            setSwapFrom((prev: any) => {
                              return {
                                ...prev,
                                amount: e.target.value,
                              };
                            });
                          }}
                        />
                      </div>
                      <div className="text-sm">
                        {swapFrom && swapFrom?.name}
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        setOpenTokenModal({ type: 'from', state: true })
                      }
                    >
                      <div className="rounded-full border border-gray-200 p-0.5 flex flex-row items-center cursor-pointer">
                        {swapFrom ? (
                          <>
                            <div>
                              <img
                                src={swapFrom?.logoURI}
                                className="w-8 h-8 p-1 mr-0.5"
                                alt=""
                              />
                            </div>
                            <div className="text-sm pr-2">
                              {swapFrom.symbol}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm py-1.5 px-2">
                            Select token
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                      <div className="text-lg font-bold">
                        <input
                          type="number"
                          className="placeholder:text-gray-500 !outline-none 
                          focus:border-b focus:border-black border-b border-transparent"
                          placeholder="0"
                          onChange={(e: any) => {
                            setSwapTo((prev: any) => {
                              return {
                                ...prev,
                                amount: e.target.value,
                              };
                            });
                          }}
                        />
                      </div>
                      <div className="text-sm">{swapTo && swapTo?.name}</div>
                    </div>
                    <div
                      onClick={() =>
                        setOpenTokenModal({ type: 'to', state: true })
                      }
                    >
                      <div className="rounded-full border border-gray-200 p-0.5 flex flex-row items-center cursor-pointer">
                        {swapTo ? (
                          <>
                            <div>
                              <img
                                src={swapTo?.logoURI}
                                className="w-8 h-8 p-1 mr-0.5"
                                alt=""
                              />
                            </div>
                            <div className="text-sm pr-2">{swapTo.symbol}</div>
                          </>
                        ) : (
                          <div className="text-sm py-1.5 px-2">
                            Select token
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div
                    className={`border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer text-center hover:bg-gray-100 transition-all ${
                      (!swapFrom || !swapTo || !connectedWallet) &&
                      'bg-gray-100'
                    }`}
                    onClick={() => getPrice()}
                  >
                    {swapFrom && swapTo && connectedWallet
                      ? 'Swap'
                      : !connectedWallet
                      ? 'Connect Wallet'
                      : !swapFrom || !swapTo
                      ? 'Select a token'
                      : null}
                  </div>
                </div>
                {swapFrom && swapTo && connectedWallet && (
                  <div className="w-1/2 text-sm mt-2">
                    Estimated Gas: <div></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          <div className="text-xs">
            <span className="text-gray-500">built by </span>
            <a
              href="https://github.com/elionntechguy"
              target="blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-all underline"
            >
              elionntechguy
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Swap;
