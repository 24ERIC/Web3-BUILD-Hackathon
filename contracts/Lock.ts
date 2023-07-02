import { context } from 'near-sdk-as';

class Lock {
    public unlockTime: u64;
    public owner: string;

    constructor(unlockTime: u64) {
        if (context.blockTimestamp >= unlockTime) {
            throw new Error("Unlock time should be in the future");
        }

        this.unlockTime = unlockTime;
        this.owner = "";
    }

    withdraw(): void {
        if (context.blockTimestamp < this.unlockTime) {
            throw new Error("You can't withdraw yet");
        }
        if (context.sender !== this.owner) {
            throw new Error("You aren't the owner");
        }

        // Emitting the Withdrawal event is not supported in plain TypeScript.
        // You can handle events differently in your NEAR contract.

        // owner.transfer(address(this).balance);
        // The transfer functionality should be implemented according to the NEAR-specific mechanisms.
    }
}
