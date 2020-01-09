import crypto from 'crypto';

export default function generateHMAC(data: string, secret: string) {
  return crypto
    .createHmac('sha1', secret)
    .update(data)
    .digest('hex');
}
