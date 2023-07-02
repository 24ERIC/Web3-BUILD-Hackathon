import { near } from 'near-sdk-core';

// Import the Proposal interface from the appropriate location
import { Proposal } from './interfaces/Proposals';

class OTCReputation {
    proposals: Proposal[];
    admin: string;

    constructor() {
        this.proposals = [];
        this.admin = "";
    }

    createProposal(proposalMsg: string, deadlineBlock: number, sender: string): void {
        const proposalIndex = this.proposals.length;
        const newProposal: Proposal = {
            proposalMsg,
            initiator: sender,
            counterParty: "",
            attestor: "",
            status: "initiated",
            deadlineBlock,
        };

        this.proposals.push(newProposal);

        this.emitProposalCreation(newProposal, proposalIndex);
    }

    matchProposal(proposalIndex: number, sender: string): void {
        this.proposals[proposalIndex].status = "matched";
        this.proposals[proposalIndex].counterParty = sender;

        this.emitCounterPartyMatched(this.proposals[proposalIndex], proposalIndex);
    }

    attestProposal(proposalIndex: number, sender: string): void {
        this.proposals[proposalIndex].status = "executable";
        this.proposals[proposalIndex].attestor = sender;

        this.emitAttestorMatched(this.proposals[proposalIndex], proposalIndex);
    }

    executeProposal(proposalIndex: number, sender: string): void {
        if (this.proposals[proposalIndex].attestor !== sender) {
            throw new Error("Only attestor can execute the proposal");
        }

        if (near.env.blockIndex > this.proposals[proposalIndex].deadlineBlock) {
            this.proposals[proposalIndex].status = "executed";

            this.emitProposalExecuted(this.proposals[proposalIndex], proposalIndex);
        } else {
            this.proposals[proposalIndex].status = "expired";

            this.emitProposalExpired(this.proposals[proposalIndex], proposalIndex);
        }
    }

    // Functions for emitting events (implementation may vary in NEAR contract)
    emitProposalCreation(proposal: Proposal, proposalIndex: number): void {
        console.log(
            "Emitting proposalCreation event:",
            proposal,
            proposalIndex
        );
        // Implement the actual event emission logic for NEAR contract
    }

    emitCounterPartyMatched(proposal: Proposal, proposalIndex: number): void {
        console.log(
            "Emitting counterPartyMatched event:",
            proposal,
            proposalIndex
        );
        // Implement the actual event emission logic for NEAR contract
    }

    emitAttestorMatched(proposal: Proposal, proposalIndex: number): void {
        console.log("Emitting attestorMatched event:", proposal, proposalIndex);
        // Implement the actual event emission logic for NEAR contract
    }

    emitProposalExecuted(proposal: Proposal, proposalIndex: number): void {
        console.log("Emitting proposalExecuted event:", proposal, proposalIndex);
        // Implement the actual event emission logic for NEAR contract
    }

    emitProposalExpired(proposal: Proposal, proposalIndex: number): void {
        console.log("Emitting proposalExpired event:", proposal, proposalIndex);
        // Implement the actual event emission logic for NEAR contract
    }
}
