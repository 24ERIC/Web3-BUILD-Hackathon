interface IWorldID {
    verifyProof(
        root: number,
        groupId: number,
        signalHash: number,
        nullifierHash: number,
        externalNullifierHash: number,
        proof: [number, number, number, number, number, number, number, number]
    ): void;
}
