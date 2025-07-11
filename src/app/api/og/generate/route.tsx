/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import { ImageResponse } from 'next/og';
import { baseURL, person } from '@/resources';

export const runtime = 'edge';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get('title') || 'Portfolio';

  /*
  // Example for local font loading — enable if you need it
  const fontData = await fetch(
    new URL('../../../public/fonts/Inter.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());
  */

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: '8rem',
          background: '#151515',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '4rem',
            fontStyle: 'normal',
            color: 'white',
          }}
        >
          <span
            style={{
              fontSize: '8rem',
              lineHeight: '8rem',
              letterSpacing: '-0.05em',
              whiteSpace: 'pre-wrap',
              textWrap: 'balance',
            }}
          >
            {title}
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5rem',
            }}
          >
            {/* eslint-disable-next-line */}
            <img
              src={baseURL + person.avatar}
              style={{
                width: '12rem',
                height: '12rem',
                objectFit: 'cover',
                borderRadius: '100%',
              }}
              alt={`${person.name} avatar`} /* accessibility + ESLint */
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <span
                style={{
                  fontSize: '4.5rem',
                  lineHeight: '4.5rem',
                  whiteSpace: 'pre-wrap',
                  textWrap: 'balance',
                }}
              >
                {person.name}
              </span>
              <span
                style={{
                  fontSize: '2.5rem',
                  lineHeight: '2.5rem',
                  whiteSpace: 'pre-wrap',
                  textWrap: 'balance',
                  opacity: '0.6',
                }}
              >
                {person.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1280,
      height: 720,
      /*
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
        },
      ],
      */
    }
  );
}
