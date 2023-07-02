import { context, storage, logging, u32 } from 'near-sdk-as';

// Create a keccak256 hash of a bytestring
export function hashToField(value: Uint8Array): string {
    const hashBytes = context.hash(value);
    const result = u32((hashBytes[0] << 24) | (hashBytes[1] << 16) | (hashBytes[2] << 8) | hashBytes[3]) >> 8;
    return result.toString();
}
