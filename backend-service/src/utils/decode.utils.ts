import * as asn1_1 from 'asn1js';
const stripHexPrefix = require('strip-hex-prefix');
import { KMS } from 'aws-sdk';
import { BigNumber } from 'bignumber.js';

export function decodeAWSSignature(signature: KMS.CiphertextType) {
  let S: BigNumber;
  let R: BigNumber;
  const { r, s } = parseBERSignature(signature as Buffer);
  R = bufferToBigNumber(r);
  S = bufferToBigNumber(s);
  S = makeCanonical(S);

  return { S: S!, R: R! };
}

export function bigNumberToBuffer(
  input: BigNumber,
  lengthInBytes: number,
): Buffer {
  let hex = input.toString(16);
  const hexLength = lengthInBytes * 2; // 2 hex characters per byte.
  if (hex.length < hexLength) {
    hex = '0'.repeat(hexLength - hex.length) + hex;
  }
  return stringToBuffer(ensureLeading0x(hex)) as Buffer;
}

/**
 * AWS returns DER encoded signatures but DER is valid BER
 */
function parseBERSignature(b: Buffer): { r: Buffer; s: Buffer } {
  const { result } = asn1_1.fromBER(toArrayBuffer(b));

  const parts = (result as asn1_1.Sequence).valueBlock
    .value as asn1_1.BitString[];
  if (parts.length < 2) {
    throw new Error('Invalid signature parsed');
  }
  const [part1, part2] = parts;

  return {
    r: Buffer.from(part1.valueBlock.valueHex),
    s: Buffer.from(part2.valueBlock.valueHex),
  };
}

function toArrayBuffer(b: Buffer): ArrayBuffer {
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

function bufferToBigNumber(input: Buffer): BigNumber {
  return new BigNumber(ensureLeading0x(input.toString('hex')));
}

function ensureLeading0x(input: string) {
  return input.startsWith('0x') ? input : `0x${input}`;
}

function makeCanonical(S: BigNumber): BigNumber {
  // tslint:disable-next-line:import-blacklist
  const EC = require('elliptic').ec;
  const secp256k1Curve = new EC('secp256k1');
  const curveN = bufferToBigNumber(secp256k1Curve.curve.n);
  const isCanonical = S.comparedTo(curveN.dividedBy(2)) <= 0;
  if (!isCanonical) {
    return curveN.minus(S);
  }
  return S;
}

function stringToBuffer(str: string): Buffer {
  return Buffer.from(padToEven(stripHexPrefix(str)), 'hex');
}

/**
 * Pads a `String` to have an even length
 * @param {String} str
 * @returns {String} output
 */
function padToEven(str: string): string {
  return str.length % 2 ? `0${str}` : str;
}
