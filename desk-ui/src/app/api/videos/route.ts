import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { videoPath } = await req.json();
    console.log(videoPath);

    if (!fs.existsSync(videoPath)) {
      return new NextResponse('Video not found', { status: 404 });
    }

    const videoFilePath = path.resolve(videoPath);
    const stat = fs.statSync(videoFilePath);
    const fileSize = stat.size;
    const range = req.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoFilePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': 'video/mp4',
      };
      return new NextResponse(file as any, { status: 206, headers: head });
    } else {
      const head = {
        'Content-Length': fileSize.toString(), 
        'Content-Type': 'video/mp4',
      };
      const file = fs.createReadStream(videoFilePath);
      return new NextResponse(file as any, { status: 200, headers: head });
    }
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}