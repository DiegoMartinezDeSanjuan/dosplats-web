import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const BUCKET = process.env.SUPABASE_BUCKET || 'menus';
  try {
    const { data, error } = await supabaseServer.storage.from(BUCKET).list('', {
      limit: 100,
      sortBy: { column: 'updated_at', order: 'desc' }
    });
    if (error) throw error;
    res.status(200).json(data);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'error' });
  }
}
