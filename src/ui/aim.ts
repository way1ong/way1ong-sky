// "Point the phone at the sky": listens to the phone's tilt and tells where its back looks. A trial behind a
// button — the reading stays on the device, nothing is sent anywhere. The sums are in core/aim.ts.
import { SKY } from '../config.ts';
import { backOfPhone, bearingOf, eased, noNorth, readTilt, type North } from '../core/aim.ts';
import type { Vec3 } from '../core/vec.ts';

export interface AimEvents {
  /** The back of the phone looks here now: the compass bearing and the height, degrees. */
  look(azimuth: number, altitude: number): void;
  /** The phone must lie flat for a moment before it knows the north. Called once for each start. */
  needsLevel(): void;
  /** It ended by itself: the device reports no tilt (`none`) or its owner did not allow it (`denied`). */
  ended(why: 'none' | 'denied'): void;
}

export interface Aim {
  /** Is there any point in offering the button: a device held in the hand whose browser knows of tilt. */
  readonly offered: boolean;
  readonly on: boolean;
  /** Call it from a press of a button: an iPhone asks its owner for the permission only then. */
  start(): Promise<void>;
  stop(): void;
}

/** What iPhones add to the browser's event class. */
interface AskingClass {
  requestPermission?: () => Promise<string>;
}

export function createAim(events: AimEvents): Aim {
  const offered = typeof DeviceOrientationEvent !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  let on = false;
  let north: North = noNorth();
  let at: Vec3 | null = null;
  let last = 0;
  let heard = false;
  let askedLevel = false;
  let wait = 0;
  let awake: WakeLockSentinel | null = null;

  // The screen must not go dark while the phone is held up to the sky; not every browser can promise that.
  const keepAwake = () => {
    if (!on || document.visibilityState !== 'visible' || !('wakeLock' in navigator)) return;
    navigator.wakeLock.request('screen').then(
      (lock) => {
        if (on) awake = lock;
        else void lock.release();
      },
      () => undefined,
    );
  };

  const onTilt = (e: DeviceOrientationEvent) => {
    const heading = (e as DeviceOrientationEvent & { webkitCompassHeading?: number | null }).webkitCompassHeading;
    const read = readTilt({ alpha: e.alpha, beta: e.beta, gamma: e.gamma, absolute: e.absolute, webkitCompassHeading: heading }, north);
    north = read.north;
    if (read.needsLevel) {
      heard = true;
      if (!askedLevel) events.needsLevel();
      askedLevel = true;
      return;
    }
    if (!read.tilt) return;
    heard = true;
    const target = backOfPhone(read.tilt);
    at = at ? eased(at, target, e.timeStamp - last) : target;
    last = e.timeStamp;
    const seen = bearingOf(at);
    events.look(seen.azimuth, seen.altitude);
  };

  function stop(): void {
    if (!on) return;
    on = false;
    window.removeEventListener('deviceorientationabsolute', onTilt as EventListener);
    window.removeEventListener('deviceorientation', onTilt);
    document.removeEventListener('visibilitychange', keepAwake);
    window.clearTimeout(wait);
    void awake?.release();
    awake = null;
  }

  async function start(): Promise<void> {
    if (on || !offered) return;
    const ask = (DeviceOrientationEvent as unknown as AskingClass).requestPermission;
    if (typeof ask === 'function') {
      // Only a plain "no" stops here: a browser that has not decided yet still may report the tilt, and one
      // that does not is told so after the wait below.
      const answer = await ask.call(DeviceOrientationEvent).catch(() => 'denied' as const);
      if (answer === 'denied') {
        events.ended('denied');
        return;
      }
    }
    on = true;
    at = null;
    heard = false;
    askedLevel = false;
    window.addEventListener('deviceorientationabsolute', onTilt as EventListener);
    window.addEventListener('deviceorientation', onTilt);
    document.addEventListener('visibilitychange', keepAwake);
    keepAwake();
    wait = window.setTimeout(() => {
      if (!on || heard) return;
      stop();
      events.ended('none');
    }, SKY.aim.waitMs);
  }

  return {
    offered,
    get on() {
      return on;
    },
    start,
    stop,
  };
}
