import Head from 'next/head';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const connect = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setConnectedWallet(connect[0]);
      } catch (error) {
        setConnectedWallet(null);
      }
    } else {
      setConnectedWallet(null);
    }
  };

  useEffect(() => {
    connectWallet();
  }, [connectedWallet]);

  return (
    <>
      <Head>
        <title>SwapIt</title>
      </Head>
      <Component
        {...pageProps}
        connectWallet={connectWallet}
        connectedWallet={connectedWallet}
      />
    </>
  );
}
