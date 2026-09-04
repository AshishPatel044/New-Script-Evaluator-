import {NextResponse} from 'next/server';
import mammoth from 'mammoth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({error: 'Please choose a document.'}, {status: 400});
    }
    const name = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = name.endsWith('.docx')
      ? (await mammoth.extractRawText({buffer})).value
      : buffer.toString('utf8');
    if (!text.trim()) return NextResponse.json({error: 'The document contains no readable text.'}, {status: 422});
    return NextResponse.json({text: text.replace(/\r\n?/g, '\n').trim()});
  } catch (error) {
    console.error('document_extract_error', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({error: 'Could not read that document. Please use a .docx or .txt file.'}, {status: 422});
  }
}
