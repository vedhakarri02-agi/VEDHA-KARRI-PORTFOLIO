import { ImageResponse } from 'next/og';
import { getPortfolio } from '@/lib/content';

export const alt = 'Portfolio preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
// Re-generate at most hourly; social networks cache previews anyway.
export const revalidate = 3600;

export default async function OpengraphImage() {
  const { data } = await getPortfolio();
  const { profile } = data;
  const [first, ...rest] = profile.full_name.split(/\s+/);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          color: '#f4fbf6',
          backgroundColor: '#030805',
          backgroundImage:
            'radial-gradient(ellipse at 50% -20%, rgba(5,150,105,0.45), transparent 60%), linear-gradient(rgba(52,211,153,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.08) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 60px 60px, 60px 60px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 24, letterSpacing: 6, color: '#34d399', textTransform: 'uppercase' }}>
          Portfolio / B.Sc. (Hons) Agriculture
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 104, fontWeight: 700, letterSpacing: -3 }}>
            <span>{first}&nbsp;</span>
            <span style={{ color: '#34d399' }}>{rest.join(' ')}</span>
          </div>
          <div style={{ display: 'flex', marginTop: 16, fontSize: 32, color: '#9bb5a3', maxWidth: 1000 }}>
            {profile.headline}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#61826b' }}>
          <span>{profile.location}</span>
          {profile.open_to_work ? (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: '#34d399', marginRight: 12 }} />
              Open for Research & Agronomy Opportunities
            </span>
          ) : (
            <span />
          )}
        </div>
      </div>
    ),
    size,
  );
}
