/* eslint-disable @typescript-eslint/no-unused-vars */

import { prisma } from '@/lib/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
