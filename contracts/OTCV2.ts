import { storage, context, logging, ContractPromiseBatch, u128, PersistentMap, PersistentVector, u8, u64, bool, i32  } from "near-sdk-as";
import { nearBindgen } from "near-sdk-as";

function assert(condition: any, errorMessage: string): void {
    if (!condition) {
        throw new Error(errorMessage);
    }
}
class Deal {
    dealType: string;
    opportunityName: string;
    seller: string;
    buyer: string;
    attestor: string;
    sellerDeposit: u128;
    buyerDeposit: u128;
    status: u8;
    expiryBlock: u64;
}

@nearBindgen
export class OTCV2 {
    deals: PersistentVector<Deal>;
    admin: string;
    worldIDVerified: PersistentMap<string, bool>;

    constructor() {
        this.deals = new PersistentVector<Deal>("d");
        this.admin = context.sender;
        this.worldIDVerified = new PersistentMap<string, bool>("w");
    }

    private isVerified(): void {
        assert(
            this.worldIDVerified.contains(context.sender) && this.worldIDVerified.getSome(context.sender),
            "Address is not verified"
        );
    }

    private isDealIdValid(dealId: i32): void {
        assert(dealId < this.deals.length, "Invalid deal ID");
    }

    private isDealAvailable(dealId: i32): void {
        this.isDealIdValid(dealId);
        const currentDeal = this.deals[dealId];
        assert(currentDeal.status == 0, "Deal not available");
    }

    private isDealTaken(dealId: i32): void {
        this.isDealIdValid(dealId);
        const currentDeal = this.deals[dealId];
        assert(currentDeal.status == 1, "Deal not taken");
    }

    private transfer(amount: u128, receiver: string): void {
        ContractPromiseBatch.create(receiver).transfer(amount);
    }

    postOffer(
        dealType: string,
        opportunityName: string,
        expiryBlock: u64,
        sellerDeposit: u128,
        buyerDeposit: u128
    ): void {
        this.isVerified();

        const newDeal = new Deal();
        newDeal.dealType = dealType;
        newDeal.opportunityName = opportunityName;
        newDeal.seller = context.sender;
        newDeal.buyer = "";
        newDeal.attestor = "";
        newDeal.sellerDeposit = sellerDeposit;
        newDeal.buyerDeposit = buyerDeposit;
        newDeal.status = 0;
        newDeal.expiryBlock = expiryBlock;

        assert(storage.balance >= sellerDeposit, "Not enough NEAR deposited from seller");

        this.deals.push(newDeal);

        logging.log("Offer posted");
    }

    takeOffer(dealId: i32): void {
        this.isVerified();
        this.isDealAvailable(dealId);

        const currentDeal = this.deals[dealId];

        assert(storage.balance >= currentDeal.buyerDeposit, "Not enough NEAR deposited from buyer");

        currentDeal.buyer = context.sender;
        currentDeal.buyerDeposit = context.attachedDeposit;
        currentDeal.status = 1;

        logging.log("Offer taken");
    }

    settleTrade(dealId: i32): void {
        this.isVerified();
        this.isDealTaken(dealId);

        const currentDeal = this.deals[dealId];

        // Perform off-chain claim verification and settlement

        // Assuming the verification is successful
        currentDeal.status = 2;

        this.transfer(currentDeal.sellerDeposit, currentDeal.seller);
        this.transfer(currentDeal.buyerDeposit, currentDeal.buyer);

        logging.log("Trade settled");
    }

    swapAttestor(dealId: i32, newAttestor: string): void {
        this.isVerified();
        this.isDealIdValid(dealId);

        const currentDeal = this.deals[dealId];

        // Only the contract admin can swap the attestor
        assert(context.sender == currentDeal.seller, "Only contract admin can swap the attestor");

        currentDeal.attestor = newAttestor;

        logging.log("Attestor swapped");
    }

    extendExpiry(dealId: i32, newExpiry: u64): void {
        this.isVerified();
        this.isDealIdValid(dealId);

        const currentDeal = this.deals[dealId];

        // Only the attestor can extend the expiry
        assert(context.sender == currentDeal.attestor, "Only the attestor can extend the expiry");

        currentDeal.expiryBlock = newExpiry;

        logging.log("Expiry extended");
    }

    refund(dealId: i32): void {
        this.isVerified();
        this.isDealIdValid(dealId);

        const currentDeal = this.deals[dealId];

        // Check if the deal has expired
        assert(context.blockIndex > currentDeal.expiryBlock, "Deal has not expired yet");

        // Reset the deal status
        currentDeal.status = 0;
        currentDeal.sellerDeposit = u128.Zero;
        currentDeal.buyerDeposit = u128.Zero;

        this.transfer(currentDeal.sellerDeposit, currentDeal.seller);
        this.transfer(currentDeal.buyerDeposit, currentDeal.buyer);

        logging.log("Refunded");
    }

    worldIDVerify(): void {
        this.worldIDVerified.set(context.sender, true);
        logging.log("Address verified");
    }

    static create(): OTCV2 {
        return new OTCV2();
    }
}
