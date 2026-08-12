// app/api/markdown/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  try {
    // ⚡ Add /*turbopackIgnore: true*/ to prevent Turbopack from tracing process.cwd()
    const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), safePath);

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const processed = await remark().use(html).process(fileContents);
    const htmlContent = processed.toString();

    return new NextResponse(htmlContent, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load markdown' },
      { status: 500 }
    );
  }
}