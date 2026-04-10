import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const palette = {
  bg: '#05070d',
  bg2: '#0a0f18',
  card: 'rgba(255,255,255,0.06)',
  stroke: 'rgba(255,255,255,0.16)',
  text: '#f5f7ff',
  muted: 'rgba(245,247,255,0.6)',
  accent: '#ff6a33',
  green: '#39d98a',
};

const GlassCard = ({ children, style = {} }) => (
  <div
    style={{
      borderRadius: 26,
      background: `linear-gradient(160deg, rgba(255,255,255,0.08), ${palette.card})`,
      border: `1px solid ${palette.stroke}`,
      boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
      backdropFilter: 'blur(16px)',
      color: palette.text,
      ...style,
    }}
  >
    {children}
  </div>
);

const Cursor = ({ x, y, click }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 22,
      height: 30,
      borderRadius: 4,
      background: '#fff',
      clipPath: 'polygon(0 0, 0 100%, 35% 75%, 60% 100%, 72% 93%, 47% 67%, 100% 67%)',
      filter: `drop-shadow(0 0 18px rgba(255,255,255,${0.4 + click * 0.4}))`,
      transform: `scale(${1 - click * 0.15})`,
      zIndex: 50,
    }}
  />
);

const AnimatedBackground = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const drift = interpolate(frame, [0, 900], [0, 180]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${20 + drift / 20}% 20%, rgba(255,106,51,0.28), transparent 40%),
        radial-gradient(circle at ${75 - drift / 30}% 70%, rgba(57,217,138,0.15), transparent 45%),
        linear-gradient(160deg, ${palette.bg}, ${palette.bg2})`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: width * 1.2,
          height,
          left: -200,
          top: 0,
          background:
            'repeating-linear-gradient(100deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 2px, transparent 2px, transparent 120px)',
          transform: `translateX(${drift * -0.5}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const sceneProgress = (f, from, to) => Math.max(0, Math.min(1, (f - from) / (to - from)));

const Scene1Marketplace = () => {
  const frame = useCurrentFrame();
  const intro = spring({ frame, fps: 30, config: { damping: 18, stiffness: 120 } });
  const pan = interpolate(frame, [0, 150], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        transform: `perspective(1400px) translateZ(${interpolate(intro, [0, 1], [120, 0])}px) scale(${interpolate(intro, [0, 1], [1.1, 1])}) translateX(${interpolate(pan, [0, 1], [-90, 70])}px) rotateY(${interpolate(pan, [0, 1], [8, -6])}deg)`,
      }}
    >
      <div style={{ position: 'absolute', top: 130, left: 140, color: palette.text }}>
        <div style={{ fontSize: 78, fontWeight: 700, lineHeight: 1.05 }}>Browse creator marketplace</div>
        <div style={{ fontSize: 32, marginTop: 16, color: palette.muted }}>Vetted talent. Instant discovery.</div>
      </div>

      {[0, 1, 2].map((i) => (
        <GlassCard
          key={i}
          style={{
            position: 'absolute',
            top: 360 + (i % 2) * 30,
            left: 140 + i * 520,
            width: 460,
            height: 380,
            transform: `translateY(${Math.sin((frame + i * 20) / 22) * 8}px)`,
          }}
        >
          <div style={{ padding: 26 }}>
            <div style={{ fontSize: 38, fontWeight: 700 }}>{['Emma Chen', 'Marcus Johnson', 'Sofia Rivera'][i]}</div>
            <div style={{ marginTop: 8, color: palette.muted, fontSize: 22 }}>{['Lifestyle', 'Fitness', 'Food'][i]} creator</div>
            <div style={{ marginTop: 26, height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.08)' }}>
              <div
                style={{
                  height: '100%',
                  width: `${[92, 88, 95][i]}%`,
                  borderRadius: 999,
                  background: 'linear-gradient(90deg,#ff6a33,#ff8f63)',
                  boxShadow: '0 0 18px rgba(255,106,51,0.8)',
                }}
              />
            </div>
          </div>
        </GlassCard>
      ))}
    </AbsoluteFill>
  );
};

const Scene2Brief = () => {
  const frame = useCurrentFrame();
  const inSpring = spring({ frame: frame - 150, fps: 30, config: { damping: 14 } });
  const typedChars = Math.floor(interpolate(frame, [160, 280], [0, 35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const text = 'Boston spring launch creator campaign';
  const cursorX = interpolate(frame, [150, 300], [700, 1190]);
  const cursorY = interpolate(frame, [150, 300], [370, 375]);

  return (
    <AbsoluteFill
      style={{
        transform: `perspective(1200px) translateZ(${interpolate(inSpring, [0, 1], [180, 0])}px) scale(${interpolate(inSpring, [0, 1], [0.85, 1])})`,
      }}
    >
      <GlassCard style={{ position: 'absolute', left: 210, top: 170, width: 1500, height: 740, padding: 46 }}>
        <div style={{ fontSize: 62, fontWeight: 700 }}>Post brief</div>
        <div style={{ marginTop: 12, color: palette.muted, fontSize: 30 }}>Tell us the goal. We handle matching.</div>

        <div style={{ marginTop: 60, fontSize: 24, color: palette.muted }}>Brief title</div>
        <GlassCard style={{ marginTop: 12, height: 100, padding: '0 24px', display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 40 }}>{text.slice(0, typedChars)}</div>
          <div style={{ width: 3, height: 48, background: palette.accent, marginLeft: 10, opacity: frame % 16 < 8 ? 1 : 0 }} />
        </GlassCard>

        <div style={{ marginTop: 34, fontSize: 24, color: palette.muted }}>Description</div>
        <GlassCard style={{ marginTop: 12, height: 280, padding: 24, fontSize: 28, color: palette.muted }}>
          Looking for 3 creators for launch-week Reels featuring behind-the-scenes stories and conversion CTA.
        </GlassCard>
      </GlassCard>

      <Cursor x={cursorX} y={cursorY} click={sceneProgress(frame, 200, 215)} />
    </AbsoluteFill>
  );
};

const Scene3Matching = () => {
  const frame = useCurrentFrame();
  const local = frame - 300;
  const zoom = interpolate(local, [0, 180], [1.08, 1]);

  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
      <GlassCard style={{ position: 'absolute', left: 140, top: 340, width: 410, height: 250, padding: 24 }}>
        <div style={{ fontSize: 28, color: palette.muted }}>Draft Brief</div>
        <div style={{ marginTop: 14, fontSize: 40, fontWeight: 700 }}>Launch Campaign</div>
      </GlassCard>

      {[0, 1, 2].map((i) => {
        const reveal = spring({ frame: local - i * 12, fps: 30, config: { damping: 16 } });
        const x = 980;
        const y = 200 + i * 240;
        return (
          <React.Fragment key={i}>
            <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
              <path
                d={`M 550 460 C 700 ${460 - 90 + i * 70}, 840 ${y}, ${x} ${y}`}
                stroke={`rgba(255,106,51,${0.25 + reveal * 0.75})`}
                strokeWidth={4 + reveal * 3}
                fill="none"
              />
            </svg>
            <GlassCard
              style={{
                position: 'absolute',
                left: x,
                top: y - 80,
                width: 660,
                height: 160,
                padding: 24,
                transform: `translateX(${interpolate(reveal, [0, 1], [80, 0])}px) scale(${interpolate(reveal, [0, 1], [0.95, 1])})`,
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 700 }}>{['Emma Chen', 'Aaliyah Davis', 'Marcus Johnson'][i]}</div>
              <div style={{ color: palette.muted, marginTop: 8, fontSize: 25 }}>Compatibility {['95%', '91%', '87%'][i]}</div>
            </GlassCard>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

const Scene4Profile = () => {
  const frame = useCurrentFrame();
  const local = frame - 480;
  const expand = spring({ frame: local, fps: 30, config: { damping: 18 } });
  const xPan = interpolate(local, [0, 180], [30, -20]);

  return (
    <AbsoluteFill style={{ transform: `translateX(${xPan}px)` }}>
      <GlassCard
        style={{
          position: 'absolute',
          left: 200,
          top: 140,
          width: 1520,
          height: 800,
          padding: 46,
          transform: `scale(${interpolate(expand, [0, 1], [0.75, 1])})`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 30,
              background: 'linear-gradient(160deg, rgba(255,106,51,0.6), rgba(255,106,51,0.2))',
              display: 'grid',
              placeItems: 'center',
              fontSize: 54,
              fontWeight: 700,
            }}
          >
            EC
          </div>
          <div>
            <div style={{ fontSize: 72, fontWeight: 700 }}>Emma Chen</div>
            <div style={{ color: palette.muted, fontSize: 28, marginTop: 8 }}>Lifestyle creator · 12K followers · 95% response rate</div>
          </div>
        </div>

        <div style={{ marginTop: 34, color: palette.muted, fontSize: 29, maxWidth: 1180 }}>
          Boston-based creator known for authentic neighborhood stories and conversion-focused short-form content.
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
          {[14.2, 28.5, 9.8].map((v, i) => (
            <GlassCard key={v} style={{ flex: 1, height: 420, position: 'relative', overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(160deg, rgba(255,255,255,${0.07 + i * 0.02}), rgba(255,255,255,0.02))`,
                }}
              />
              <div style={{ position: 'absolute', bottom: 26, left: 26, fontSize: 24, color: palette.muted }}>{v}K views</div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>
    </AbsoluteFill>
  );
};

const Scene5Messaging = () => {
  const frame = useCurrentFrame();
  const local = frame - 660;
  const zoom = interpolate(local, [0, 240], [1.08, 1]);
  const cursorX = interpolate(local, [40, 140, 170], [1150, 1260, 1260], { extrapolateRight: 'clamp' });
  const cursorY = interpolate(local, [40, 140, 170], [840, 840, 780], { extrapolateRight: 'clamp' });
  const sendPop = spring({ frame: local - 165, fps: 30, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
      <GlassCard style={{ position: 'absolute', left: 320, top: 150, width: 1280, height: 780, padding: 30 }}>
        <div style={{ fontSize: 40, fontWeight: 700 }}>Message creator</div>
        <div style={{ marginTop: 18, color: palette.muted, fontSize: 25 }}>Emma Chen is online now</div>

        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <GlassCard style={{ alignSelf: 'flex-start', width: 760, padding: 20, fontSize: 27 }}>
            Hi Emma — loved your local storytelling style.
          </GlassCard>
          <GlassCard style={{ alignSelf: 'flex-end', width: 710, padding: 20, fontSize: 27, borderColor: 'rgba(255,106,51,0.65)' }}>
            We’d like to move forward. Can you start Monday?
          </GlassCard>
        </div>

        <GlassCard style={{ position: 'absolute', left: 34, right: 34, bottom: 34, height: 100, display: 'flex', alignItems: 'center', padding: '0 20px' }}>
          <div style={{ color: palette.muted, fontSize: 30 }}>Amazing — approved. Sending details now.</div>
          <div
            style={{
              marginLeft: 'auto',
              background: palette.accent,
              color: '#fff',
              borderRadius: 999,
              padding: '14px 28px',
              fontSize: 24,
              boxShadow: `0 0 ${30 + sendPop * 25}px rgba(255,106,51,0.85)`,
              transform: `scale(${1 + sendPop * 0.08})`,
            }}
          >
            Send
          </div>
        </GlassCard>
      </GlassCard>

      <Cursor x={cursorX} y={cursorY} click={sceneProgress(local, 162, 176)} />
    </AbsoluteFill>
  );
};

const SceneTransition = ({ start, end }) => {
  const frame = useCurrentFrame();
  const progress = sceneProgress(frame, end - 14, end);
  const blur = interpolate(progress, [0, 1], [0, 20]);
  const opacity = interpolate(progress, [0, 1], [0, 0.75]);

  return (
    <AbsoluteFill
      style={{
        backdropFilter: `blur(${blur}px)`,
        background: `rgba(5,7,13,${opacity})`,
        pointerEvents: 'none',
      }}
    />
  );
};

export const ProductDemoVideo = () => {
  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, SF Pro Display, system-ui, sans-serif' }}>
      <AnimatedBackground />

      <Sequence from={0} durationInFrames={150}>
        <Scene1Marketplace />
      </Sequence>

      <Sequence from={150} durationInFrames={150}>
        <Scene2Brief />
      </Sequence>

      <Sequence from={300} durationInFrames={180}>
        <Scene3Matching />
      </Sequence>

      <Sequence from={480} durationInFrames={180}>
        <Scene4Profile />
      </Sequence>

      <Sequence from={660} durationInFrames={240}>
        <Scene5Messaging />
      </Sequence>

      {[
        [0, 150],
        [150, 300],
        [300, 480],
        [480, 660],
      ].map(([start, end]) => (
        <SceneTransition key={end} start={start} end={end} />
      ))}
    </AbsoluteFill>
  );
};
