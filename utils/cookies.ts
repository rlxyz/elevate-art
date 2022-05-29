import nookies, { destroyCookie } from "nookies";
import { MintPhase } from "state/token";

export const SELECTED_WALLET_KEY = "reflections.dreamlabs.selectedWallet";

export function getSelectedWallet(): string {
  return nookies.get()[SELECTED_WALLET_KEY];
}

export function setSelectedWallet(walletName: string) {
  nookies.set(null, SELECTED_WALLET_KEY, walletName, {
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export function removeSelectedWallet() {
  destroyCookie(null, SELECTED_WALLET_KEY);
}

const baseTrxKey = "reflections.trx.";

export function setSuccessfulTransactionHash(address: string, trxHash: string) {
  nookies.set(null, `${baseTrxKey}${address}`, trxHash);
}

export function getSuccessfulTransactionHash(address: string) {
  const key = `${baseTrxKey}${address}`;
  return nookies.get()[key];
}

export function setSuccessfulTransactionHashWithPhase(
  address: string,
  trxHash: string,
  phase: MintPhase
) {
  nookies.set(null, `${baseTrxKey}${address}${phase}`, trxHash);
}

export function getSuccessfulTransactionHashWithPhase(
  address: string,
  phase: MintPhase
) {
  const key = `${baseTrxKey}${address}${phase}`;
  return nookies.get()[key];
}
