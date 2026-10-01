"use client";

/**
 * GlobeMap — 3D world globe (globe.gl + three) for the AI Geo Maps tool.
 *
 * SSR-safe: `globe.gl` is imported dynamically inside useEffect (it touches
 * window/WebGL at init). `three` is safe at module level. If WebGL is
 * unavailable or init throws, a styled categorized fallback list renders so
 * the page keeps working everywhere.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { GlobeInstance } from "globe.gl";
import { AlertTriangle, Globe as GlobeIcon } from "lucide-react";
import {
  GEO_CATEGORIES,
  GEO_ITEMS,
  getCategory,
  type GeoCategoryKey,
  type GeoItem,
} from "@/lib/geo-data";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/* ------------------------------ brand palette ------------------------------ */

const NAVY = "#0A1B3D";
const NAVY_DEEP = "#060F26";
const GOLD = "#C9A24B";
const CAP = "#EDE3CE";
const LABEL = "#FAF8F2";

const DEFAULT_POV = { lat: 14, lng: 78, altitude: 2.15 };

export interface GlobeMapProps {
  /** Filtered dataset (parent owns filtering) */
  items: GeoItem[];
  /** Currently active category keys (parent owns layer toggles) */
  activeCategories: GeoCategoryKey[];
  /** Selected item id — triggers label + ring + fly-to */
  selectedId: string | null;
  /** Fired when a point / path marker is clicked */
  onSelect: (id: string) => void;
  /** Auto-rotation toggle */
  spinning: boolean;
  /** Raw globe clicks (used by the map quiz) */
  onGlobeClick?: (lat: number, lng: number) => void;
  /** Bump to reset the camera to the default point of view */
  resetSignal?: number;
  className?: string;
}

/* --------------------------------- helpers --------------------------------- */

function tooltip(title: string, sub: string, color: string): string {
  return (
    `<div style="background:${NAVY_DEEP}ee;border:1px solid ${GOLD}66;border-radius:8px;` +
    `padding:6px 10px;color:${LABEL};font:600 12px/1.45 'Inter',system-ui,sans-serif;` +
    `max-width:230px;box-shadow:0 6px 18px rgba(0,0,0,.35);">` +
    `<span style="color:${color};font-weight:800;text-transform:uppercase;letter-spacing:.06em;font-size:10px;">${sub}</span><br/>` +
    `<span style="font-weight:700;">${title}</span></div>`
  );
}

/* --------------------------------- component -------------------------------- */

export function GlobeMap({
  items,
  activeCategories,
  selectedId,
  onSelect,
  spinning,
  onGlobeClick,
  resetSignal,
  className,
}: GlobeMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const spinningRef = useRef(spinning);
  const resumeTimerRef = useRef<number | null>(null);
  const onSelectRef = useRef(onSelect);
  const onGlobeClickRef = useRef(onGlobeClick);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  /* Keep latest callbacks in refs (no re-binding of globe handlers) */
  useEffect(() => {
    onSelectRef.current = onSelect;
    onGlobeClickRef.current = onGlobeClick;
  });

  /* Resolve the selected item from the FULL dataset (not just the filtered
     slice) so quiz "Show on map" always finds its target. */
  const selectedItem = useMemo(
    () => (selectedId ? (GEO_ITEMS.find((i) => i.id === selectedId) ?? null) : null),
    [selectedId]
  );

  /* ---------------------------------- init ---------------------------------- */

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let disposed = false;
    let ro: ResizeObserver | null = null;

    const hasWebGL = (() => {
      try {
        const canvas = document.createElement("canvas");
        return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      } catch {
        return false;
      }
    })();

    if (!hasWebGL) {
      setFailed(true);
      return;
    }

    const init = async () => {
      try {
        /* CRITICAL: dynamic import keeps globe.gl out of SSR bundles */
        const Globe = (await import("globe.gl")).default;
        if (disposed || !containerRef.current) return;

        const globe: GlobeInstance = new Globe(containerRef.current, {
          rendererConfig: { antialias: true, alpha: true },
        });
        globeRef.current = globe;

        globe
          .backgroundColor("rgba(0,0,0,0)")
          .showAtmosphere(true)
          .atmosphereColor(GOLD)
          .atmosphereAltitude(0.16);

        /* Navy globe */
        globe.globeMaterial(
          new THREE.MeshPhongMaterial({
            color: NAVY,
            emissive: new THREE.Color("#0b2350"),
            emissiveIntensity: 0.25,
            shininess: 6,
          })
        );

        /* Countries layer (Natural Earth 110m) */
        void (async () => {
          try {
            const res = await fetch("/data/countries-110m.geojson");
            if (!res.ok) return;
            const geo = (await res.json()) as { features?: object[] };
            const features = (geo.features ?? []).filter(
              (f) => Boolean((f as { geometry?: unknown }).geometry)
            );
            const g = globeRef.current;
            if (disposed || !g) return;
            g.polygonsData(features)
              .polygonCapColor(() => CAP)
              .polygonSideColor(() => "rgba(6, 15, 38, 0.18)")
              .polygonStrokeColor(() => GOLD)
              .polygonAltitude(0.006);
          } catch {
            /* countries layer is decorative — ignore failures */
          }
        })();

        /* Data layers — accessors map GeoItem → globe.gl */
        globe
          .pointLat((d) => (d as GeoItem).coords[0])
          .pointLng((d) => (d as GeoItem).coords[1])
          .pointAltitude(0.015)
          .pointRadius(0.32)
          .pointColor((d) => getCategory((d as GeoItem).category).color)
          .pointLabel((d) => {
            const it = d as GeoItem;
            return tooltip(it.name, getCategory(it.category).label, getCategory(it.category).color);
          })
          .onPointClick((point) => onSelectRef.current((point as GeoItem).id))
          .pathsData([])
          .pathPoints((d) => (d as GeoItem).line ?? [(d as GeoItem).coords])
          .pathPointAlt(0.012)
          .pathStroke(1.6)
          .pathColor((d) => getCategory((d as GeoItem).category).color)
          .pathLabel((d) => {
            const it = d as GeoItem;
            return tooltip(it.name, getCategory(it.category).label, getCategory(it.category).color);
          })
          .onPathClick((path) => onSelectRef.current((path as GeoItem).id))
          .labelsData([])
          .labelLat((d) => (d as GeoItem).coords[0])
          .labelLng((d) => (d as GeoItem).coords[1])
          .labelText((d) => (d as GeoItem).name)
          .labelColor(() => LABEL)
          .labelSize(1.05)
          .labelDotRadius(0.25)
          .labelAltitude(0.03)
          .labelResolution(2)
          .ringsData([])
          .ringLat((d) => (d as GeoItem).coords[0])
          .ringLng((d) => (d as GeoItem).coords[1])
          .ringColor(() => (t: number) => `rgba(201, 162, 75, ${Math.max(0, 1 - t)})`)
          .ringMaxRadius(3.5)
          .ringPropagationSpeed(1.4)
          .ringRepeatPeriod(900);

        /* Quiz clicks */
        globe.onGlobeClick((coords) => onGlobeClickRef.current?.(coords.lat, coords.lng));

        /* Camera + controls */
        const controls = globe.controls();
        controls.autoRotateSpeed = 0.55;
        controls.autoRotate = spinningRef.current;
        controls.minDistance = 130;
        controls.maxDistance = 520;
        globe.pointOfView(DEFAULT_POV);

        globe.onGlobeReady(() => {
          if (disposed) return;
          setReady(true);
        });

        /* Resize handling */
        ro = new ResizeObserver((entries) => {
          const g = globeRef.current;
          if (!g) return;
          const rect = entries[0]?.contentRect;
          const w = rect?.width ?? el.clientWidth;
          const h = rect?.height ?? el.clientHeight;
          if (w > 0 && h > 0) g.width(w).height(h);
        });
        ro.observe(el);
      } catch (err) {
        console.error("[GlobeMap] init failed:", err);
        if (!disposed) setFailed(true);
      }
    };

    void init();

    return () => {
      disposed = true;
      if (ro) ro.disconnect();
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
      try {
        globeRef.current?._destructor();
      } catch {
        /* noop */
      }
      globeRef.current = null;
      el.innerHTML = "";
    };
  }, []);

  /* ------------------------------ spin control ------------------------------ */

  useEffect(() => {
    spinningRef.current = spinning;
    const g = globeRef.current;
    if (!g || !ready) return;
    if (spinning && resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    g.controls().autoRotate = spinning;
  }, [spinning, ready]);

  /* --------------------------- data layer updates --------------------------- */

  useEffect(() => {
    const g = globeRef.current;
    if (!g || !ready) return;
    const active = new Set<GeoCategoryKey>(activeCategories);
    g.pointsData(items.filter((i) => i.kind === "point" && active.has(i.category)));
    g.pathsData(items.filter((i) => i.kind === "line" && active.has(i.category)));
  }, [items, activeCategories, ready]);

  /* ---------------------- selection: label, ring, fly-to -------------------- */

  useEffect(() => {
    const g = globeRef.current;
    if (!g || !ready) return;

    g.labelsData(selectedItem ? [selectedItem] : []);
    g.ringsData(selectedItem ? [selectedItem] : []);

    if (selectedItem) {
      g.pointOfView(
        { lat: selectedItem.coords[0], lng: selectedItem.coords[1], altitude: 1.7 },
        900
      );
      /* Pause the spin briefly so the fly-to lands cleanly, then resume. */
      if (spinningRef.current) {
        g.controls().autoRotate = false;
        if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = window.setTimeout(() => {
          const gg = globeRef.current;
          if (gg) gg.controls().autoRotate = spinningRef.current;
          resumeTimerRef.current = null;
        }, 4000);
      }
    }
  }, [selectedItem, ready]);

  /* -------------------------------- reset view ------------------------------- */

  const firstReset = useRef(true);
  useEffect(() => {
    if (firstReset.current) {
      firstReset.current = false;
      return;
    }
    const g = globeRef.current;
    if (!g || !ready) return;
    g.pointOfView(DEFAULT_POV, 900);
  }, [resetSignal, ready]);

  /* ------------------------------ fallback view ------------------------------ */

  if (failed) {
    return (
      <div className={cn("flex h-full w-full flex-col", className)} role="status">
        <div className="flex items-center gap-2 bg-navy-deep px-4 py-3 text-ivory">
          <AlertTriangle className="h-4 w-4 shrink-0 text-gold" aria-hidden />
          <p className="text-sm font-semibold">3D view unavailable on this device</p>
        </div>
        <p className="border-b border-border/60 px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">
          Your browser or device doesn&apos;t support WebGL, so the 3D globe can&apos;t render.
          Explore every location in the categorized list below instead.
        </p>
        <div className="nice-scroll max-h-[560px] flex-1 overflow-y-auto bg-card px-4 py-4">
          {GEO_CATEGORIES.map((cat) => {
            const catItems = items.filter((i) => i.category === cat.key);
            if (catItems.length === 0) return null;
            return (
              <div key={cat.key} className="mb-5 last:mb-1">
                <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: cat.color }}
                    aria-hidden
                  />
                  {cat.label}
                  <span className="font-medium normal-case text-muted-foreground">
                    ({catItems.length})
                  </span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {catItems.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => onSelect(it.id)}
                      className={cn(
                        "min-h-9 rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground/80 transition-colors hover:border-secondary hover:text-primary",
                        it.id === selectedId && "border-secondary bg-secondary/15 text-primary"
                      )}
                    >
                      {it.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* -------------------------------- main view -------------------------------- */

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* three/globe.gl mounts here */}
      <div ref={containerRef} className="absolute inset-0" aria-label="Interactive 3D globe" />

      {/* Loading overlay */}
      {!ready ? (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-navy"
          role="status"
          aria-label="Loading 3D globe"
        >
          <span className="relative flex h-14 w-14 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold/20" aria-hidden />
            <GlobeIcon className="h-10 w-10 animate-pulse text-gold" aria-hidden />
          </span>
          <p className="text-sm font-medium text-ivory/80">Preparing the 3D globe…</p>
          <div className="flex gap-2" aria-hidden>
            <Skeleton className="h-2 w-16 bg-ivory/10" />
            <Skeleton className="h-2 w-10 bg-ivory/10" />
            <Skeleton className="h-2 w-14 bg-ivory/10" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
