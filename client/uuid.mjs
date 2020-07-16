let rnds = new Array(16);
let rng = function () {
    for (let i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        rnds[i] = (r >>> ((i & 0x03) << 3)) & 0xff;
    }
    return rnds;
};

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).substr(1));
}

function bytesToUuid(buf, offset_) {
    const offset = offset_ || 0;

    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    return (
        byteToHex[buf[offset + 0]] +
        byteToHex[buf[offset + 1]] +
        byteToHex[buf[offset + 2]] +
        byteToHex[buf[offset + 3]] +
        "-" +
        byteToHex[buf[offset + 4]] +
        byteToHex[buf[offset + 5]] +
        "-" +
        byteToHex[buf[offset + 6]] +
        byteToHex[buf[offset + 7]] +
        "-" +
        byteToHex[buf[offset + 8]] +
        byteToHex[buf[offset + 9]] +
        "-" +
        byteToHex[buf[offset + 10]] +
        byteToHex[buf[offset + 11]] +
        byteToHex[buf[offset + 12]] +
        byteToHex[buf[offset + 13]] +
        byteToHex[buf[offset + 14]] +
        byteToHex[buf[offset + 15]]
    ).toLowerCase();
}

function v4(options, buf, offset) {
    options = options || {};

    const rnds = options.random || (options.rng || rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
        offset = offset || 0;

        for (let i = 0; i < 16; ++i) {
            buf[offset + i] = rnds[i];
        }

        return buf;
    }

    return bytesToUuid(rnds);
}

export default v4;
