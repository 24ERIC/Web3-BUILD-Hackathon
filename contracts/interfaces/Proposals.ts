interface Proposal {
    proposalMsg: string;
    initiator: string;
    counterParty: string;
    attestor: string;
    status: string;
    deadlineBlock: number;
}

enum ProposalStatus {
    Initiated = "initiated",
    Matched = "matched",
    Executable = "executable",
    Executed = "executed",
    Expired = "expired",
}

export { Proposal, ProposalStatus };
