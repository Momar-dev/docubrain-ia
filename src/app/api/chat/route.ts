import { NextResponse } from 'next/server';
import { findRelevantSections, askQuestion } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. Chercher le contexte pertinent dans Supabase
    const sections = await findRelevantSections(message);
    const context = sections.map((s: any) => s.content).join("\n---\n");

    // 2. Demander à Gemini de répondre en utilisant ce contexte
    const answer = await askQuestion(message, context || "Aucun document n'a été trouvé pour le moment.");

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Erreur Chat API:", error);
    return NextResponse.json({ error: "Désolé, une erreur est survenue lors de l'analyse." }, { status: 500 });
  }
}
