import Swap from '../components/Swap';

interface IHome {
  connectedWallet: string | null;
  connectWallet: void;
}

export default function Home({ connectedWallet, connectWallet }: IHome) {
  return (
    <Swap connectedWallet={connectedWallet} connectWallet={connectWallet} />
  );
}
