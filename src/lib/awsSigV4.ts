import { createHash, createHmac } from 'node:crypto';

// Amazon PA-API v5 requires AWS Signature Version 4 signed POST requests.
// This is a minimal signer for exactly PA-API's needs (JSON POST, single fixed target).
function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac('sha256', key).update(data, 'utf8').digest();
}

function sha256Hex(data: string): string {
  return createHash('sha256').update(data, 'utf8').digest('hex');
}

export interface PaApiSignedRequest {
  url: string;
  headers: Record<string, string>;
  body: string;
}

export function signPaApiRequest(params: {
  host: string; // e.g. webservices.amazon.in
  region: string; // e.g. eu-west-1
  accessKey: string;
  secretKey: string;
  target: string; // e.g. com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems
  payload: Record<string, unknown>;
}): PaApiSignedRequest {
  const { host, region, accessKey, secretKey, target, payload } = params;
  const service = 'ProductAdvertisingAPI';
  const method = 'POST';
  const canonicalUri = `/paapi5/${target.split('.').pop()!.toLowerCase()}`;
  const body = JSON.stringify(payload);

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ''); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8);

  const canonicalHeaders =
    `content-encoding:amz-1.0\n` +
    `content-type:application/json; charset=utf-8\n` +
    `host:${host}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-target:${target}\n`;
  const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';

  const canonicalRequest = [method, canonicalUri, '', canonicalHeaders, signedHeaders, sha256Hex(body)].join('\n');

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, sha256Hex(canonicalRequest)].join('\n');

  const kDate = hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, 'aws4_request');
  const signature = hmac(kSigning, stringToSign).toString('hex');

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    url: `https://${host}${canonicalUri}`,
    headers: {
      'content-encoding': 'amz-1.0',
      'content-type': 'application/json; charset=utf-8',
      host,
      'x-amz-date': amzDate,
      'x-amz-target': target,
      Authorization: authorization,
    },
    body,
  };
}
