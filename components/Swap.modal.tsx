import { Transition, Dialog } from '@headlessui/react';
import { Fragment, useEffect, useState, FC } from 'react';

import { FixedSizeList as List } from 'react-window';

import { swapToken, token } from '../types';

interface ISwapModal {
  open: IOpen | null;
  setOpen: any;
  tokens: token[];
  swapFrom: swapToken | null;
  setSwapFrom: any;
  swapTo: swapToken | null;
  setSwapTo: any;
}

interface IOpen {
  type: string;
  state: boolean;
}

const SwapModal = ({
  open,
  setOpen,
  tokens,
  swapFrom,
  setSwapFrom,
  swapTo,
  setSwapTo,
}: ISwapModal) => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchedTokens, setSearchedTokens] = useState<token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<token[]>([]);

  const selectSwap = ({
    chainId,
    address,
    name,
    symbol,
    decimals,
    logoURI,
  }: token) => {
    const props = {
      chainId,
      address,
      name,
      symbol,
      decimals,
      logoURI,
    };

    if (open?.type === 'from') {
      if (swapTo?.symbol !== props.symbol) {
        setSwapFrom(props);
        setOpen(null);
      }
    } else if (open?.type === 'to') {
      if (swapFrom?.symbol !== props.symbol) {
        setSwapTo(props);
        setOpen(null);
      }
    }
  };

  useEffect(() => {
    if (!open) {
      setFilteredTokens([]);
    } else if (tokens) {
      setFilteredTokens(tokens);
    }
  }, [tokens, open]);

  useEffect(() => {
    if (open) {
      if (swapFrom) {
        setFilteredTokens((prev: token[]) => {
          const from = swapFrom;
          const filtered = prev.filter(
            (token: token) => token.symbol !== from.symbol
          );
          filtered.unshift(from);
          return filtered;
        });
      }
      if (swapTo) {
        setFilteredTokens((prev: token[]) => {
          const to = swapTo;
          const filtered = prev.filter(
            (token: token) => token.symbol !== to.symbol
          );
          filtered.unshift(to);
          return filtered;
        });
      }
    }
  }, [swapFrom, swapTo, open]);

  useEffect(() => {
    if (searchKeyword.length) {
      setSearchedTokens((_) =>
        filteredTokens.filter((token: token) =>
          token.name.toLowerCase().includes(searchKeyword.toLowerCase())
        )
      );
    } else {
      setSearchedTokens(filteredTokens);
    }
  }, [searchKeyword]);

  const tokensFirstRow: token[] = [
    {
      chainId: 1,
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    },
    {
      chainId: 1,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      name: 'Dai',
      symbol: 'DAI',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/9956/large/4943.png?1636636734',
    },
    {
      chainId: 1,
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      decimals: 8,
      logoURI:
        'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1548822744',
    },
    {
      chainId: 1,
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/2518/large/weth.png?1628852295',
    },
  ];

  const tokensSecondRow: token[] = [
    {
      chainId: 1,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      logoURI:
        'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389',
    },
    {
      chainId: 1,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      name: 'Tether',
      symbol: 'USDT',
      decimals: 6,
      logoURI:
        'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
    },
  ];

  const renderTokenRow = (data: token[]) => {
    return data.map((token, i) => (
      <div
        className={`rounded-full border border-gray-200 p-0.5 flex flex-row items-center ${
          (swapFrom?.symbol === token.symbol ||
            swapTo?.symbol === token.symbol) &&
          'bg-gray-200 border-gray-400'
        } cursor-pointer`}
        key={`${token.name}-${i}`}
        onClick={() => selectSwap(token)}
      >
        <div>
          <img src={token.logoURI} className="w-8 h-8 p-1 mr-0.5" alt="" />
        </div>
        <div className="text-sm pr-2">{token.symbol}</div>
      </div>
    ));
  };

  const renderArr = ({ data, index, style }: any) => {
    if (data[index] !== undefined) {
      return (
        <div
          className={`flex flex-row space-x-4 px-6 py-3 items-center cursor-pointer hover:bg-gray-200 transition-all ${
            (swapFrom?.symbol === data[index].symbol ||
              swapTo?.symbol === data[index].symbol) &&
            'bg-gray-200 cursor-default'
          }`}
          style={style}
          key={`${data[index].name}-${index}`}
          onClick={() => selectSwap(data[index])}
        >
          <div>
            <img
              src={data[index].logoURI}
              className="w-8 h-8 rounded-full border border-gray-200"
              alt=""
            />
          </div>
          <div className="flex-col">
            <div className="font-semibold">{data[index].name}</div>
            <div className="text-sm font-light">{data[index].symbol}</div>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <Transition appear show={open ? open.state : false} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm max-h-[600px] transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                <div className="px-6 pt-6">
                  <Dialog.Title className="font-medium leading-6 text-gray-900">
                    Select a token
                  </Dialog.Title>
                  <div className="w-full relative mt-3">
                    <div className="absolute ml-3 top-2.5">
                      <img src="/static/search.svg" alt="" />
                    </div>
                    <input
                      type="text"
                      className="w-full h-10 rounded-lg border border-gray-200 !outline-gray-200 pl-10"
                      placeholder="Search name or address"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchKeyword(e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex flex-col space-y-1 px-6">
                    <div className="flex flex-row space-x-1">
                      {renderTokenRow(tokensFirstRow)}
                    </div>
                    <div className="flex flex-row space-x-1">
                      {renderTokenRow(tokensSecondRow)}
                    </div>
                  </div>
                  <div className="h-[300px] w-full overflow-auto border-t border-gray-200">
                    <List
                      width={384}
                      height={299}
                      itemCount={
                        searchKeyword.trim().length !== 0
                          ? searchKeyword.length
                          : filteredTokens.length
                      }
                      itemSize={68}
                      itemData={
                        searchKeyword.trim().length !== 0
                          ? searchedTokens
                          : filteredTokens
                      }
                    >
                      {renderArr}
                    </List>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SwapModal;
