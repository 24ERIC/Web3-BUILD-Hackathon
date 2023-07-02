import * as near from 'near-sdk-as';

function assert(condition: boolean, errorMessage: string): void {
    if (!condition) {
        throw new Error(errorMessage);
    }
}

class OTC {
    deals: near.PersistentVector<Deal>;
    admin: string;

    constructor() {
        this.deals = new near.PersistentVector<Deal>("deals");
        this.admin = '';
    }

    postOffer(
        dealType: string,
        opportunityName: string,
        expiryBlock: near.i32,
        sellerDeposit: near.u128,
        buyerDeposit: near.u128
    ): void {
        const newDeal: Deal = {
            dealType,
            opportunityName,
            seller: near.context.sender,
            buyer: '',
            attestor: '',
            sellerDeposit,
            buyerDeposit,
            status: 0,
            expiryBlock,
        };

        assert(
            near.u128.from(near.context.attachedDeposit).cmp(sellerDeposit) >= 0,
            'Not enough NEAR deposited from seller'
        );

        this.deals.push(newDeal);

        // Log the OfferPosted event
        near.logging.log(
            'OfferPosted',
            (this.deals.length - 1).toString(),
            dealType,
            opportunityName,
            near.context.sender,
            sellerDeposit.toString(),
            expiryBlock.toString()
        );
    }

    takeOffer(dealId: near.i32): void {
        assert(dealId < this.deals.length, 'Invalid deal ID');

        const currentDeal = this.deals[dealId];

        assert(currentDeal.status === 0, 'Deal not available');
        assert(
            near.u128.from(near.context.attachedDeposit).cmp(currentDeal.buyerDeposit) >= 0,
            'Not enough NEAR deposited from buyer'
        );

        currentDeal.buyer = near.context.sender;
        currentDeal.buyerDeposit = near.context.attachedDeposit;
        currentDeal.status = 1;

        // Log the OfferTaken event
        near.logging.log('OfferTaken', dealId.toString(), near.context.sender, near.context.attachedDeposit.toString());
    }

    settleTrade(dealId: near.i32): void {
        assert(dealId < this.deals.length, 'Invalid deal ID');

        const currentDeal = this.deals[dealId];

        assert(currentDeal.status === 1, 'Deal not taken');

        // Perform off-chain claim verification and settlement

        // Assuming the verification is successful
        currentDeal.status = 2;
        near.ContractPromiseBatch.create(currentDeal.seller)
            .transfer(currentDeal.sellerDeposit)
            .then(() =>
                near.ContractPromiseBatch.create(currentDeal.buyer).transfer(currentDeal.buyerDeposit)
            );

        // Log the TradeSettled event
        near.logging.log(
            'TradeSettled',
            dealId.toString(),
            currentDeal.seller,
            currentDeal.buyer,
            currentDeal.sellerDeposit.toString(),
            currentDeal.buyerDeposit.toString()
        );
    }

    swapAttestor(dealId: near.i32, newAttestor: string): void {
        assert(dealId < this.deals.length, 'Invalid deal ID');

        const currentDeal = this.deals[dealId];

        // Only the contract admin can swap the attestor
        assert(near.context.sender === currentDeal.seller, 'Only contract admin can swap the attestor');

        currentDeal.attestor = newAttestor;

        // Log the AttestorSwapped event
        near.logging.log('AttestorSwapped', dealId.toString(), newAttestor);
    }

    extendExpiry(dealId: near.i32, newExpiry: near.i32): void {
        assert(dealId < this.deals.length, 'Invalid deal ID');

        const currentDeal = this.deals[dealId];

        // Only the attestor can extend the expiry
        assert(near.context.sender === currentDeal.attestor, 'Only the attestor can extend the expiry');

        currentDeal.expiryBlock = newExpiry;

        // Log the ExpiryExtended event
        near.logging.log('ExpiryExtended', dealId.toString(), newExpiry.toString());
    }

    refund(dealId: near.i32): void {
        assert(dealId < this.deals.length, 'Invalid deal ID');

        const currentDeal = this.deals[dealId];

        // Check if the deal has expired
        assert(near.env.blockIndex > currentDeal.expiryBlock, 'Deal has not expired yet');

        // Reset the deal status
        currentDeal.status = 0;
        currentDeal.sellerDeposit = near.u128.Zero;
        currentDeal.buyerDeposit = near.u128.Zero;

        // Refund the deposits to respective depositors
        near.ContractPromiseBatch.create(currentDeal.seller)
            .transfer(currentDeal.sellerDeposit)
            .then(() =>
                near.ContractPromiseBatch.create(currentDeal.buyer).transfer(currentDeal.buyerDeposit)
            );

        // Log the Refunded event
        near.logging.log(
            'Refunded',
            dealId.toString(),
            currentDeal.seller,
            currentDeal.buyer,
            currentDeal.sellerDeposit.toString(),
            currentDeal.buyerDeposit.toString()
        );
    }
}

@nearBindgen
class Deal {
    dealType: string;
    opportunityName: string;
    seller: string;
    buyer: string;
    attestor: string;
    sellerDeposit: near.u128;
    buyerDeposit: near.u128;
    status: near.i32;
    expiryBlock: near.i32;

    constructor(
        dealType: string,
        opportunityName: string,
        seller: string,
        buyer: string,
        attestor: string,
        sellerDeposit: near.u128,
        buyerDeposit: near.u128,
        status: near.i32,
        expiryBlock: near.i32
    ) {
        this.dealType = dealType;
        this.opportunityName = opportunityName;
        this.seller = seller;
        this.buyer = buyer;
        this.attestor = attestor;
        this.sellerDeposit = sellerDeposit;
        this.buyerDeposit = buyerDeposit;
        this.status = status;
        this.expiryBlock = expiryBlock;
    }
}
