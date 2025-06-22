/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { baseURL } from '@/resources';

export const runtime = 'edge';

export async function GET() {
  const cover = `${baseURL}/images/projects/project-01/cover-01.jpg`;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#151515',
          color: '#fff',
          fontSize: '64px',
          padding: '40px',
        }}
      >
        <img
          src={cover}
          alt="The Liminal cover"
          style={{ width: '40%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }}
        />
        <div
          style={{
            display: 'flex',
            flex: 1,
            paddingLeft: '40px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontWeight: 700 }}>The Liminal</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
