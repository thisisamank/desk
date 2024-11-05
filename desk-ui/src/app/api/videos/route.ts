import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

function generateContentType(filePath: string): string {
  const extension = path.extname(filePath).slice(1).toLowerCase();
  
  const mimeTypes: { [key: string]: string } = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    txt: 'text/plain',
    html: 'text/html',
  };

  return mimeTypes[extension] || 'application/octet-stream';
}

export async function POST(req: NextRequest) {
  try {
    const { filePath } = await req.json(); 
    console.log('Requested Path:', filePath);

    const resolvedPath = path.resolve(filePath);

    
    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
      const files = fs.readdirSync(resolvedPath);
      return NextResponse.json(files); 
    }

    if (!fs.existsSync(resolvedPath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const fileType = generateContentType(resolvedPath);
    const stat = fs.statSync(resolvedPath);
    const fileSize = stat.size;
    const range = req.headers.get('range');

    console.log('Range:', range);
    console.log('Content-Type:', fileType);

    if (fileType.startsWith('video/')) {
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(resolvedPath, { start, end });

        const headers = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': fileType,
        };

        return new NextResponse(file as any, { status: 206, headers });
      } else {
        const headers = {
          'Content-Length': fileSize.toString(),
          'Content-Type': fileType,
        };
        const file = fs.createReadStream(resolvedPath);
        return new NextResponse(file as any, { status: 200, headers });
      }
    }

    if (fileType.startsWith('image/') || fileType === 'application/pdf' || fileType === 'text/plain' || fileType === 'text/html') {
      const headers = {
        'Content-Length': fileSize.toString(),
        'Content-Type': fileType,
      };
      const file = fs.createReadStream(resolvedPath);
      return new NextResponse(file as any, { status: 200, headers });
    }

    return new NextResponse('Unsupported file type', { status: 415 });
    
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}
