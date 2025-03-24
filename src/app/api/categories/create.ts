/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, type } = req.body;

    if (!name || !type || !['debit', 'credit'].includes(type)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      const newCategory = await prisma.category.create({
        data: { name, type },
      });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create category' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
