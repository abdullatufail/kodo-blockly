import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Kodo on a cream tile for home screens (iOS doesn't use SVG icons).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f4ea' }}>
        <div style={{ position: 'relative', width: 140, height: 140, borderRadius: 70, background: '#f58b4c', display: 'flex' }}>
          <div style={{ position: 'absolute', left: 44, top: 34, width: 22, height: 34, borderRadius: 11, background: '#11140f' }} />
          <div style={{ position: 'absolute', left: 76, top: 34, width: 22, height: 34, borderRadius: 11, background: '#11140f' }} />
        </div>
      </div>
    ),
    size
  );
}
