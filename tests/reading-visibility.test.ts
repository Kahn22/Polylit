import { afterEach, describe, expect, it, vi } from "vitest";
import { observeVisibleReadingUnits } from "../src/app/reading-visibility.js";
afterEach(() => vi.unstubAllGlobals());
function fixture() {
  const events = new Map<string, () => void>();
  const addEventListener = (name: string, handler: () => void) => events.set(name, handler);
  const removeEventListener = (name: string) => events.delete(name);
  const page = { hidden: false, addEventListener, removeEventListener };
  vi.stubGlobal("document", page);
  vi.stubGlobal("window", { innerWidth: 1000, innerHeight: 600, addEventListener, removeEventListener });
  const first = { dataset: { readingUnit: "first" }, isConnected: true, getBoundingClientRect: () => ({ top: 0, bottom: 100, left: 0, right: 800, width: 800, height: 100 }) } as unknown as HTMLElement;
  let top = 900;
  const second = { dataset: { readingUnit: "second" }, isConnected: true, getBoundingClientRect: () => ({ top, bottom: top + 100, left: 0, right: 800, width: 800, height: 100 }) } as unknown as HTMLElement;
  return { page, events, first, second, scrollTo: (value: number) => { top = value; } };
}
describe("thought-unit visibility", () => {
  it("fallback encounters visible units only, once, and stops after disconnect", () => {
    const env = fixture(), encounter = vi.fn();
    const observer = observeVisibleReadingUnits([env.first, env.second], encounter);
    expect(encounter.mock.calls).toEqual([["first"]]);
    env.scrollTo(595); env.events.get("scroll")!(); // Less than ten percent.
    expect(encounter).toHaveBeenCalledTimes(1);
    env.scrollTo(550); env.events.get("scroll")!();
    expect(encounter.mock.calls).toEqual([["first"], ["second"]]);
    env.events.get("scroll")!();
    expect(encounter).toHaveBeenCalledTimes(2);
    observer.disconnect();
    expect(env.events.size).toBe(0);
  });
  it("does not encounter hidden-tab, detached, or cancelled units", () => {
    const env = fixture(), encounter = vi.fn();
    env.page.hidden = true;
    const observer = observeVisibleReadingUnits([env.first, env.second], encounter);
    expect(encounter).not.toHaveBeenCalled();
    env.page.hidden = false; env.events.get("visibilitychange")!();
    expect(encounter.mock.calls).toEqual([["first"]]);
    Object.defineProperty(env.second, "isConnected", { value: false });
    env.scrollTo(100); env.events.get("scroll")!();
    expect(encounter).toHaveBeenCalledTimes(1);
    const stale = env.events.get("scroll")!;
    observer.disconnect(); stale();
    expect(encounter).toHaveBeenCalledTimes(1);
  });
  it("ignores queued observer callbacks after leaving Learning View", () => {
    const env = fixture(), encounter = vi.fn();
    let callback: IntersectionObserverCallback;
    const mock = { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    class Observer { constructor(cb: IntersectionObserverCallback) { callback = cb; return mock; } }
    Object.assign(window, { IntersectionObserver: Observer });
    vi.stubGlobal("IntersectionObserver", Observer);
    const observer = observeVisibleReadingUnits([env.first], encounter);
    const deliver = (ratio: number) => callback([{ target: env.first, isIntersecting: true, intersectionRatio: ratio } as unknown as IntersectionObserverEntry], mock as unknown as IntersectionObserver);
    deliver(0); expect(encounter).not.toHaveBeenCalled();
    env.page.hidden = true; deliver(1); expect(encounter).not.toHaveBeenCalled();
    env.page.hidden = false;
    observer.disconnect(); deliver(1);
    expect(encounter).not.toHaveBeenCalled();
  });
});
