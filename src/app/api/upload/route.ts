import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { extractTextFromPDF, uploadDocumentToSupabase } from '@/lib/ai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Lire le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extraire le texte du PDF
    const text = await extractTextFromPDF(buffer);

    // Vectoriser et stocker dans Supabase
    await uploadDocumentToSupabase(file.name, text);

    return NextResponse.json({ success: true, message: `${file.name} uploaded and processed successfully.` });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
