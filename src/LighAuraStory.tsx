import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const ease = Easing.inOut(Easing.cubic);

const FRAMES = [
  // 01 — Accroche / apparition dans la brume
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3JC2KrTgsjqbB57ToMi30MBd9J1/7e18893d-ee13-496b-b8f5-283b49ed2bcd.png',
  // 02 — Assemblage éclaté du casque
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3JC2KrTgsjqbB57ToMi30MBd9J1/817cbcd5-7fcb-4416-91aa-314c2dadeb21.png',
  // 03 — Révélation du casque assemblé
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3JC2KrTgsjqbB57ToMi30MBd9J1/03943bb1-2ffb-4053-84f4-723abf7c66fe.png',
  // 04 — Hero close-up premium
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3JC2KrTgsjqbB57ToMi30MBd9J1/0da8c5d1-b89d-4e67-aa63-40e7488512c5.png',
  // 05 — Transition vers la collection
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3JC2KrTgsjqbB57ToMi30MBd9J1/d73d1f59-6100-4ef5-be4f-5e23f68872f2.png',
  // 06 — Action / boutique
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3JC2KrTgsjqbB57ToMi30MBd9J1/5087bd23-8131-4a22-a52d-114633102f64.png',
] as const;

type Shot = {
  src: string;
  start: number;
  end: number;
  zoomFrom: number;
  zoomTo: number;
  xFrom: number;
  xTo: number;
  yFrom: number;
  yTo: number;
  fadeIn: number;
  fadeOut: number;
};

const SHOTS: Shot[] = [
  {src: FRAMES[0], start: 0, end: 72, zoomFrom: 1.055, zoomTo: 1.018, xFrom: 12, xTo: 0, yFrom: 4, yTo: 0, fadeIn: 0, fadeOut: 14},
  {src: FRAMES[1], start: 58, end: 138, zoomFrom: 1.035, zoomTo: 1.005, xFrom: 8, xTo: -6, yFrom: 0, yTo: 0, fadeIn: 14, fadeOut: 14},
  {src: FRAMES[2], start: 124, end: 202, zoomFrom: 1.018, zoomTo: 1.055, xFrom: -4, xTo: 8, yFrom: 0, yTo: -2, fadeIn: 14, fadeOut: 14},
  {src: FRAMES[3], start: 188, end: 258, zoomFrom: 1.065, zoomTo: 1.015, xFrom: 18, xTo: 0, yFrom: 0, yTo: 0, fadeIn: 14, fadeOut: 12},
  {src: FRAMES[4], start: 246, end: 322, zoomFrom: 1.03, zoomTo: 1.0, xFrom: 0, xTo: 0, yFrom: 10, yTo: 0, fadeIn: 12, fadeOut: 14},
  {src: FRAMES[5], start: 308, end: 360, zoomFrom: 1.025, zoomTo: 1.0, xFrom: 0, xTo: 0, yFrom: 8, yTo: 0, fadeIn: 14, fadeOut: 0},
];

const shotOpacity = (frame: number, shot: Shot, isFirst: boolean, isLast: boolean) => {
  const enter = isFirst
    ? 1
    : interpolate(frame, [shot.start, shot.start + shot.fadeIn], [0, 1], {...clamp, easing: ease});

  const exit = isLast
    ? 1
    : interpolate(frame, [shot.end - shot.fadeOut, shot.end], [1, 0], {...clamp, easing: ease});

  if (frame < shot.start || frame > shot.end) return 0;
  return Math.min(enter, exit);
};

const StoryFrame: React.FC<{shot: Shot; index: number}> = ({shot, index}) => {
  const frame = useCurrentFrame();
  const opacity = shotOpacity(frame, shot, index === 0, index === SHOTS.length - 1);
  const progress = interpolate(frame, [shot.start, shot.end], [0, 1], {...clamp, easing: ease});
  const scale = interpolate(progress, [0, 1], [shot.zoomFrom, shot.zoomTo]);
  const x = interpolate(progress, [0, 1], [shot.xFrom, shot.xTo]);
  const y = interpolate(progress, [0, 1], [shot.yFrom, shot.yTo]);

  return (
    <AbsoluteFill style={{opacity, overflow: 'hidden'}}>
      <Img
        src={shot.src}
        maxRetries={4}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          transformOrigin: index < 4 ? '62% 50%' : '50% 50%',
          filter: 'saturate(1.03) contrast(1.015)',
        }}
      />
    </AbsoluteFill>
  );
};

const transitionPulse = (frame: number, center: number, width: number, maxOpacity: number) => {
  const distance = Math.abs(frame - center);
  return interpolate(distance, [0, width], [maxOpacity, 0], clamp);
};

export const LighAuraStory: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const flash = Math.max(
    transitionPulse(frame, 64, 8, 0.26),
    transitionPulse(frame, 130, 8, 0.24),
    transitionPulse(frame, 195, 8, 0.22),
    transitionPulse(frame, 252, 11, 0.48),
    transitionPulse(frame, 314, 9, 0.3),
  );

  const redSweep = interpolate(frame, [78, 180], [-28, 128], clamp);
  const endFade = interpolate(frame, [durationInFrames - 18, durationInFrames - 1], [1, 0.94], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: '#f4f5f5', overflow: 'hidden'}}>
      {SHOTS.map((shot, index) => (
        <StoryFrame key={shot.src} shot={shot} index={index} />
      ))}

      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          opacity: flash,
          background:
            'radial-gradient(circle at 68% 55%, rgba(255,244,213,.98) 0%, rgba(255,255,255,.86) 24%, rgba(255,255,255,0) 68%)',
          mixBlendMode: 'screen',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: `${redSweep}%`,
          top: '-15%',
          width: 5,
          height: '130%',
          background: 'linear-gradient(180deg, transparent, rgba(198,16,45,.72), transparent)',
          boxShadow: '0 0 24px rgba(198,16,45,.32)',
          transform: 'rotate(14deg)',
          opacity: frame >= 78 && frame <= 180 ? 0.55 : 0,
        }}
      />

      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          opacity: endFade,
          boxShadow: 'inset 0 0 150px rgba(10,12,15,.08)',
          background:
            'linear-gradient(180deg, rgba(255,255,255,.03), transparent 72%, rgba(12,14,16,.045))',
        }}
      />
    </AbsoluteFill>
  );
};
