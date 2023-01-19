import BN from 'bn.js';
import { BigNumber, ethers } from 'ethers';
const QUANTUM = '10000000000';
export const convertEth = (quantizedAmount: any, quantum: any): number => {
    const ethAmount = new BN('0', 10);
    const convertEth = (quantizedAmount: any, quantum: any) => {
        const amountBn = new BN(quantizedAmount, 10);
        const quantumBn = new BN(quantum, 10);
        return amountBn.mul(quantumBn);
    };
    return Number(
        ethAmount
            .iadd(convertEth(quantizedAmount, quantum))
            .div(new BN(10 ** 18))
            .toString(10),
    );
};

export function convertAmountToQuantizedAmount(
    amount: number | string,
): number {
    const wei = convertEthToWei(String(amount));
    return BigNumber.from(wei).div(BigNumber.from(QUANTUM)).toNumber();
}

/**
 * Convert eth to wei
 * @param amount
 * @returns
 */
export function convertEthToWei(amount: string): string {
    return ethers.utils.parseEther(String(amount)).toString();
}
