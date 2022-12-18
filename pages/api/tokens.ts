// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { token } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<token[]>
) {
  const tokensReq = await fetch(
    'https://tokens.coingecko.com/uniswap/all.json'
  );

  const { tokens } = await tokensReq.json();

  res.status(200).json(tokens);
}
