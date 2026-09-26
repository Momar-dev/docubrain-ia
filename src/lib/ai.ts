import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "./supabase";
import * as pdf from "pdf-parse";
import { Buffer } from "buffer";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdf.parse(buffer);
  return data.text;
}

export async function splitTextIntoChunks(text: string, chunkSize = 800, overlap = 200) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

export async function generateEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function uploadDocumentToSupabase(name: string, text: string) {
  const chunks = splitTextIntoChunks(text);
  const sections = [];
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);
    const { data, error } = await supabase
      .from("document_sections")
      .insert({ content: chunk, embedding })
      .select();
    if (error) throw error;
    sections.push(...data);
  }
  return sections;
}

export async function findRelevantSections(queryText: string) {
  const embedding = await generateEmbedding(queryText);
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 5,
  });
  if (error) throw error;
  return data;
}

export async function askQuestion(question: string, context: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Tu es DocuBrain IA, un assistant expert en analyse de documents. Utilise UNIQUEMENT les extraits de documents suivants pour répondre. Si la réponse n'est pas dans le contexte, dis-le poliment. CONTEXTE : ${context} QUESTION : ${question} RÉPONSE :`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
