// SPDX-License-Identifier: MIT

import { utils } from 'near-api-js';
import { keccak256 } from 'js-sha3';

// Create a keccak256 hash of a bytestring
function hashToField(value: Uint8Array): string {
    const hash = utils.serialize.serialize(value);
    const hashBuffer = Buffer.from(hash);
    const hashBytes = Buffer.from(keccak256.array(hashBuffer));
    const result = hashBytes.readUInt32BE(0) >> 8;
    return result.toString();
}
