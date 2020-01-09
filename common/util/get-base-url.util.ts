import { NextPageContext } from 'next';

export default function getBaseURl({ req }: NextPageContext): string {
  const proto = req!.headers['x-forwarded-proto'] || '';
  const host = req!.headers['x-forwarded-host'] || '';

  return `${proto}://${host}`;
}
