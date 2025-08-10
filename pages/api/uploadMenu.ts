import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '@/lib/supabaseServer';
import formidable from 'formidable';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

const BUCKET = process.env.SUPABASE_BUCKET || 'menus';
const ADMIN_UPLOAD_KEY = process.env.ADMIN_UPLOAD_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!ADMIN_UPLOAD_KEY) return res.status(500).json({ error: 'Missing ADMIN_UPLOAD_KEY' });

  const form = formidable({ multiples: false, keepExtensions: true });

  try {
    const { fields, files } = await new Promise<any>((resolve, reject) => {
      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });


    const adminKey = (fields.adminKey as string) || '';
    if (adminKey !== ADMIN_UPLOAD_KEY) return res.status(401).json({ error: 'Unauthorized' });

    const file: any = files.file;
    if (!file) return res.status(400).json({ error: 'File missing' });
    if (file.mimetype !== 'application/pdf') return res.status(400).json({ error: 'Only PDF' });

    const buffer = fs.readFileSync(file.filepath);

    // Name: YYYY-MM-DD.pdf to keep order
    const today = new Date().toISOString().slice(0,10);
    const name = `${today}.pdf`;

    // Upload (overwrite if exists for the same day)
    const { error: upErr } = await supabaseServer
      .storage
      .from(BUCKET)
      .upload(name, buffer, { contentType: 'application/pdf', upsert: true });

    if (upErr) throw upErr;

    return res.status(200).json({ ok: true, name });
  } catch (e:any) {
    return res.status(500).json({ error: e?.message || 'Upload failed' });
  }
}
