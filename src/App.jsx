import { ConnectionProvider, useConnection, useWallet, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import { Buffer } from 'buffer';

// @ts-ignore
window.Buffer = Buffer;
export default function App() {
  return (
    <>
      <ConnectionProvider endpoint={`https://api.testnet.solana.com`}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 20
            }}>
              <WalletMultiButton></WalletMultiButton>
              <WalletDisconnectButton />
            </div>
            <div>
              <ReqestAirdrop />
            </div>
            <ShowBalance />
            <Transfer />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  )
}
function ReqestAirdrop() {

  const wallet = useWallet();
  const { connection } = useConnection();

  async function requestAirdrop() {
    let amount = document.getElementById("amount").value
    await connection.requestAirdrop(wallet.publicKey, amount * LAMPORTS_PER_SOL)
    alert(`airdropped ${amount}`)
  }

  return (
    <>
      <input id="amount" type="text" />
      <button onClick={requestAirdrop}></button>
    </>
  )

}
function ShowBalance() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [bal, setBal] = useState(null);

  useEffect(() => {
    async function getBalance() {
      if (wallet.publicKey) {
        const balance = await connection.getBalance(wallet.publicKey)
        setBal(balance / LAMPORTS_PER_SOL)
      }
    }
    getBalance();
  }, [wallet.publicKey, connection])
  return (
    <>
      <h1>balance is {bal !== null ? `${bal} SOL` : "Loading... "}</h1>
    </>
  )
}

function Transfer() {
  const wallet = useWallet();
  const { connection } = useConnection();

  async function sendToken() {
    let to = document.getElementById("to").value;
    let amount = document.getElementById("transferAmount").value
    const transaction = new Transaction();
    console.log("amount", amount, to)
    transaction.add(SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: new PublicKey(to),
      lamports: amount * LAMPORTS_PER_SOL,
    }))
    await wallet.sendTransaction(transaction, connection)
  }

  return (
    <div>
      <input id="to" name="to" placeholder='to' />
      <input id="transferAmount" name="amount1" placeholder='amount' />

      <button onClick={sendToken}> send</button>
    </div>
  )
}
