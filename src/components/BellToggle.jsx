'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Notification03Icon } from '@hugeicons/core-free-icons';

const SPRING_UI = { type: 'spring', duration: 0.3, bounce: 0 };
const SEG_EASE = 'cubic-bezier(0.77, 0, 0.175, 1)';
const WARP = 0.6;
const SIZES = { sm: [36, 12.5, 14, 15, 8], md: [44, 13.5, 16, 19, 9], lg: [52, 15, 18, 23, 10] };
const WOBBLE = { amplitude: 0.4, passes: 3, duration: 420 };
const BELL_BODY = 'M6 16.5V10a6 6 0 0 1 12 0v6.5l1.6 2.3H4.4L6 16.5z';

const passOffset = (k, passes) => 1 - Math.pow(1 - (k + 2 / 3) / (passes + 1), WARP);
const ringKeyframes = (from, amplitude, passes, decay) => {
  const frames = [{ transform: `rotate(${from}deg)`, offset: 0, easing: SEG_EASE }];
  for (let k = 0; k < passes; k++) {
    const angle = amplitude * Math.pow(1 - k / passes, decay) * (k % 2 ? 1 : -1);
    frames.push({ transform: `rotate(${angle.toFixed(2)}deg)`, offset: passOffset(k, passes), easing: SEG_EASE });
  }
  frames.push({ transform: 'rotate(0deg)', offset: 1 });
  return frames;
};
const liveAngle = el => {
  const tf = getComputedStyle(el);
  const transform = tf.transform;
  if (!transform || transform === 'none') return 0;
  const m = new DOMMatrix(transform);
  return (Math.atan2(m.b, m.a) * 180) / Math.PI;
};

export default function BellToggle({
  offLabel = 'Notify me',
  onLabel = "You'll be notified",
  icon,
  showIcon = true,
  label,
  color = '#f5f5f5',
  background = '#27272a',
  onColor = '#18181b',
  onBackground = '#f5f5f5',
  size = 'md',
  radius = 22,
  ringAmplitude = 17,
  ringPasses = 5,
  ringDecay = 1,
  ringDuration = 820,
  ringPivot = 16,
  crossfadeMs = 200,
  revealBounce = 0,
  count = 0,
  badge = true,
  badgeColor = '#ef4444',
  badgeTextColor = '#ffffff',
  waves = true,
  clapper = false,
  pressed,
  defaultPressed = false,
  onChange,
  disabled = false,
  className = ''
}) {
  const [inner, setInner] = useState(defaultPressed);
  const on = pressed ?? inner;
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const glyphRef = useRef(null);
  const clapperRef = useRef(null);
  const waveLeft = useRef(null);
  const waveRight = useRef(null);
  const offRef = useRef(null);
  const lastInput = useRef('pointer');
  const pending = useRef(null);
  const spring = useRef(null);
  const prevCount = useRef(count);
  const [h, fs, iconSize, px, gap] = SIZES[size] ?? SIZES.md;

  const t = useMotionValue(on ? 1 : 0);

  const swing = (amplitude, passes, duration) => {
    const el = glyphRef.current;
    if (!el) return;
    el.getAnimations().forEach(a => a.cancel());
    el.animate(ringKeyframes(liveAngle(el), amplitude, passes, ringDecay), { duration, easing: 'linear' });
    const c = clapperRef.current;
    if (c) {
      c.getAnimations().forEach(a => a.cancel());
      c.animate(ringKeyframes(liveAngle(c), amplitude * 1.6, passes, ringDecay), {
        duration,
        delay: 70,
        easing: 'linear'
      });
    }
    if (!waves) return;
    for (let k = 0; k < passes; k++) {
      const side = k % 2 ? waveRight.current : waveLeft.current;
      if (!side) continue;
      const strength = Math.pow(1 - k / passes, ringDecay);
      side.animate(
        [
          { opacity: 0, transform: 'scale(0.55)' },
          { opacity: 0.9 * strength, offset: 0.3 },
          { opacity: 0, transform: 'scale(1.25)' }
        ],
        { duration: 380, delay: passOffset(k, passes) * duration, easing: 'ease-out' }
      );
    }
  };

  useLayoutEffect(() => {
    const pointer = pending.current === 'pointer' && !reduce;
    pending.current = null;
    spring.current?.stop();
    if (pointer) spring.current = animate(t, on ? 1 : 0, { ...SPRING_UI, bounce: revealBounce });
    else t.jump(on ? 1 : 0);
    if (on && pointer && showIcon && icon !== false && icon !== null) {
      swing(ringAmplitude, ringPasses, ringDuration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);
  useLayoutEffect(() => () => spring.current?.stop(), []);

  useEffect(() => {
    const was = prevCount.current;
    prevCount.current = count;
    if (count > was && on && !reduce && showIcon) {
      swing(ringAmplitude * WOBBLE.amplitude, WOBBLE.passes, WOBBLE.duration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const toggle = () => {
    pending.current = lastInput.current;
    if (pressed === undefined) {
      setInner(!on);
    } else {
      if (on && !reduce && lastInput.current === 'pointer' && showIcon) {
        swing(ringAmplitude, ringPasses, ringDuration);
      }
    }
    onChange?.(!on);
  };
  const press = e => {
    lastInput.current = 'pointer';
    if (e.button === 0 && !disabled && rootRef.current) rootRef.current.dataset.pressed = '';
  };
  const release = () => {
    if (rootRef.current) delete rootRef.current.dataset.pressed;
  };
  const key = e => {
    if (e.key === 'Enter' || e.key === ' ') lastInput.current = 'keyboard';
  };

  const hasIcon = Boolean(showIcon && icon !== false && icon !== null);
  const showBadge = hasIcon && badge && on && count > 0;
  const currentLabel = on ? onLabel : offLabel;

  return (
    <motion.span
      ref={rootRef}
      className={`group relative inline-grid grid-cols-[max-content] select-none [-webkit-touch-callout:none] transition-transform duration-150 active:scale-[0.96] data-[pressed]:scale-[0.96] data-[disabled]:opacity-55 motion-reduce:data-[pressed]:scale-100${className ? ` ${className}` : ''}`}
      data-on={on ? 'true' : 'false'}
      data-disabled={disabled ? '' : undefined}
      style={{
        '--bt-radius': `${radius}px`,
        '--bt-h': `${h}px`,
        '--bt-fs': `${fs}px`,
        '--bt-icon': `${iconSize}px`,
        '--bt-px': `${px}px`,
        '--bt-gap': `${gap}px`
      }}
    >
      <button
        type="button"
        className="m-0 inline-flex cursor-pointer touch-manipulation items-center justify-center border-0 leading-none font-medium tracking-[0.01em] whitespace-nowrap outline-none [-webkit-tap-highlight-color:transparent] [font-family:inherit] [grid-area:1/1] [gap:var(--bt-gap)] [height:var(--bt-h)] [padding:0_var(--bt-px)] [border-radius:var(--bt-radius)] [font-size:var(--bt-fs)] transition-colors duration-200 disabled:cursor-default"
        style={{
          backgroundColor: on ? onBackground : background,
          color: on ? onColor : color,
        }}
        aria-pressed={on}
        aria-label={label ?? offLabel}
        disabled={disabled}
        onPointerDown={press}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
        onKeyDown={key}
        onClick={toggle}
      >
        {hasIcon && (
          <span
            className="relative inline-grid flex-none [width:var(--bt-icon)] [height:var(--bt-icon)]"
            aria-hidden="true"
          >
            <span
              ref={glyphRef}
              className="inline-grid place-items-center [grid-area:1/1] [width:var(--bt-icon)] [height:var(--bt-icon)] [transform-origin:50%_var(--bt-pivot)] [&_svg]:h-full [&_svg]:w-full"
            >
              {clapper ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={BELL_BODY} />
                  <path d="M12 2.5V4" />
                </svg>
              ) : (
                (icon ?? <HugeiconsIcon icon={Notification03Icon} size={iconSize} strokeWidth={2} />)
              )}
            </span>
            {clapper ? (
              <span
                ref={clapperRef}
                className="pointer-events-none absolute inset-0 [transform-origin:50%_var(--bt-pivot)] [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
              >
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="20.4" r="1.7" fill="currentColor" />
                </svg>
              </span>
            ) : null}
            {waves ? (
              <>
                <svg
                  ref={waveLeft}
                  className="pointer-events-none absolute -top-[3px] right-[calc(100%-2px)] h-3.5 w-3.5 origin-bottom-right fill-none stroke-current opacity-0 [stroke-linecap:round] [stroke-width:1.6]"
                  viewBox="0 0 14 14"
                >
                  <path d="M14 8a6 6 0 0 0-6 6" />
                  <path d="M14 4A10 10 0 0 0 4 14" />
                </svg>
                <svg
                  ref={waveRight}
                  className="pointer-events-none absolute -top-[3px] left-[calc(100%-2px)] h-3.5 w-3.5 origin-bottom-left fill-none stroke-current opacity-0 [stroke-linecap:round] [stroke-width:1.6]"
                  viewBox="0 0 14 14"
                >
                  <path d="M0 8a6 6 0 0 1 6 6" />
                  <path d="M0 4a10 10 0 0 1 10 10" />
                </svg>
              </>
            ) : null}
            {showBadge ? (
              <span
                className="pointer-events-none absolute -top-1.5 -right-[7px] box-border grid h-3.5 min-w-3.5 place-items-center rounded-[7px] px-[3px] text-[9.5px] leading-none font-semibold [background:var(--bt-badge)] [color:var(--bt-badge-ink)]"
              >
                <span className="block">
                  {count > 9 ? '9+' : count}
                </span>
              </span>
            ) : null}
          </span>
        )}
        <span className="inline-flex items-center leading-none text-current" aria-hidden="true">
          <span ref={offRef} className="opacity-100 text-current select-none font-mono">
            {currentLabel}
          </span>
        </span>
      </button>
    </motion.span>
  );
}
