import { context, ContractPromiseBatch, u128, logging } from 'near-api-js';
function assert(condition: any, errorMessage: string): void {
    if (!condition) {
        throw new Error(errorMessage);
    }
}

class OTC {
    deals: Deal[];
    admin: string;

    constructor() {
        this.deals = [];
        this.admin = '';
    }

    postOffer(
        dealType: string,
        opportunityName: string,
        expiryBlock: number,
        sellerDeposit: number,
        buyerDeposit: number
    ): void {
        const newDeal: Deal = {
            dealType,
            opportunityName,
            seller: context.sender,
            buyer: '',
            attestor: '',
            sellerDeposit,
            buyerDeposit,
            status: 0,
            expiryBlock,
        };

        assert(
            u128.from(msg.value).cmp(u128.from(sellerDeposit)) >= 0,
            'Not enough ETH deposited from seller'
        );

        this.deals.push(newDeal);

        // Log the OfferPosted event
        logging.log(
            'OfferPosted',
            this.deals.length - 1,
            dealType,
            opportunityName,
            context.sender,
            sellerDeposit,
            expiryBlock
        );
    }

    takeOffer(dealId: number): void {
        assert(dealId < this.deals.length, 'Invalid deal ID');

        const currentDeal = this.deals[dealId];

        assert(currentDeal.status === 0, 'Deal not available');
        assert(
            u128.from(msg.value).cmp(u128.from(currentDeal.buyerDeposit)) >= 0,
            'Not enough ETH deposited from buyer'
        );

        currentDeal.buyer = context.sender;
        currentDeal.buyerDeposit = msg.value;
        currentDeal.status = 1;

        // Log the OfferTaken event
        logging.log('OfferTaken', dealId, context.sender, msg.value);
    }

    settleTrade(dealId: number): void {
        assert(dealId < this.deals.length, 'Invalid deal ID');

        const currentDeal = this.deals[dealId];

        assert(currentDeal.status === 1, 'Deal not taken');

        // Perform off-chain claim verification and settlement

        // Assuming the verification is successful
        currentDeal.status = 2;
        ContractPromiseBatch.create(currentDeal.seller)
            .transfer(currentDeal.sellerDeposit.toString())
            .then(() =>
                ContractPromiseBatch.create(currentDeal.buyer).transfer(currentDeal.buyerDeposit.toString())
            );

        // Log the TradeSettled event
        logging.log(
            'TradeSettled',
            dealId,
            currentDeal.seller,
            currentDeal.buyer,
            currentDeal.sellerDeposit,
            currentDeal.buyerDeposit
        );
    }

    swapAttestor(dealId: number, newAttestor: string): void {
        assert(dealId < this.deals.length, 'Invalid deal ID');

        const currentDeal = this.deals[dealId];

        // Only the contract admin can swap the attestor
        assert(context.sender === currentDeal.seller, 'Only contract admin can swap the attestor');

        currentDeal.attestor = newAttestor;

        // Log the AttestorSwapped event
        logging.log('AttestorSwapped', dealId, newAttestor);
    }

    extendExpiry(dealId: number, newExpiry: number): void {
        assert(dealId < this.deals.length, 'Invalid deal ID');

        const currentDeal = this.deals[dealId];

        // Only the attestor can extend the expiry
        assert(context.sender === currentDeal.attestor, 'Only the attestor can extend the expiry');

        currentDeal.expiryBlock = newExpiry;

        // Log the ExpiryExtended event
        logging.log('ExpiryExtended', dealId, newExpiry);
    }

    refund(dealId: number): void {
        assert(dealId < this.deals.length, 'Invalid deal ID');

        const currentDeal = this.deals[dealId];

        // Check if the deal has expired
        assert(block.block_number > currentDeal.expiryBlock, 'Deal has not expired yet');

        // Reset the deal status
        currentDeal.status = 0;
        currentDeal.sellerDeposit = u128.Zero;
        currentDeal.buyerDeposit = u128.Zero;

        // Refund the deposits to respective depositors
        ContractPromiseBatch.create(currentDeal.seller)
            .transfer(currentDeal.sellerDeposit.toString())
            .then(() =>
                ContractPromiseBatch.create(currentDeal.buyer).transfer(currentDeal.buyerDeposit.toString())
            );

        // Log the Refunded event
        logging.log(
            'Refunded',
            dealId,
            currentDeal.seller,
            currentDeal.buyer,
            currentDeal.sellerDeposit,
            currentDeal.buyerDeposit
        );
    }
}

interface Deal {
    dealType: string;
    opportunityName: string;
    seller: string;
    buyer: string;
    attestor: string;
    sellerDeposit: u128;
    buyerDeposit: u128;
    status: number;
    expiryBlock: number;
}

// Declare the NEAR context variables
declare const context: any;
declare const msg: any;
declare const block: any;

// Declare the logging namespace for event logging
declare namespace logging {
    function log(eventName: string, ...args: any[]): void;
}

// Declare the u128 type for handling NEAR's 128-bit integers
declare const u128: any;

// Declare the ContractPromiseBatch class for handling batched promises
declare class ContractPromiseBatch {
    static create(accountId: string): ContractPromiseBatch;
    transfer(amount: string): ContractPromiseBatch;
    then(callback: () => void): void;
}
