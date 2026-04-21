import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import type {
  CatalogueItem,
  SpellCategory,
} from "../../utils/catalogueConfig.ts";

type SpellTreeProps = {
  spells: CatalogueItem[];
  allSpells: CatalogueItem[];
};

type SpellNode = CatalogueItem & {
  category: SpellCategory;
  prerequisiteSlugs: string[];
  prerequisiteNames: string[];
  matched: boolean;
  depth: number;
};

type PositionedSpellNode = SpellNode & {
  x: number;
  y: number;
};

type SpellEdge = {
  from: string;
  to: string;
};

type CategoryLayout = {
  category: SpellCategory;
  roots: number;
  nodes: PositionedSpellNode[];
  edges: SpellEdge[];
  anchor: {
    x: number;
    y: number;
  };
};

type SpellScene = {
  width: number;
  height: number;
  hub: {
    x: number;
    y: number;
  };
  categories: CategoryLayout[];
};

type Viewport = {
  x: number;
  y: number;
  scale: number;
};

const categoryOrder: SpellCategory[] = ["OFFENSIVE", "DEFENSIVE", "UTILITY"];

const levelRank: Record<string, number> = {
  ASPIRANT: 0,
  EVEILLE: 1,
  ASCENDANT: 2,
  TRANSCENDANT: 3,
  SUPREME: 4,
  SACRE: 5,
  DIVIN: 6,
};

const CATEGORY_Y: Record<SpellCategory, number> = {
  OFFENSIVE: 300,
  DEFENSIVE: 920,
  UTILITY: 1540,
};

const HUB_POSITION = { x: 220, y: 920 };
const CATEGORY_START_X = 660;
const COLUMN_GAP = 280;
const ROW_GAP = 170;
const NODE_SIZE = 124;
const NODE_RADIUS = NODE_SIZE / 2;
const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 1880;
const MIN_SCALE = 0.5;
const MAX_SCALE = 1.85;

const categoryMeta: Record<
  SpellCategory,
  {
    title: string;
    subtitle: string;
    line: string;
    glow: string;
    activeNode: string;
    contextNode: string;
    chip: string;
  }
> = {
  OFFENSIVE: {
    title: "Offensif",
    subtitle: "Impact, rafales et percuteuses arcaniques",
    line: "#d56e56",
    glow: "shadow-[0_0_0_10px_rgba(213,110,86,0.10),0_20px_50px_-24px_rgba(122,36,31,0.85)]",
    activeNode:
      "border-[#8b2d24] bg-radial-[at_35%_30%] from-[#fff8f5] via-[#f4c0b4] to-[#8b2d24] text-[#2e120f]",
    contextNode:
      "border-[#cfafa8] bg-radial-[at_35%_30%] from-white via-[#f0d8d2] to-[#b58a81] text-[#62453f]",
    chip: "border-[#8b2d24]/20 bg-[#fff2ee] text-[#8b2d24]",
  },
  DEFENSIVE: {
    title: "Defensif",
    subtitle: "Barrieres, contres et reductions mystiques",
    line: "#67a0d5",
    glow: "shadow-[0_0_0_10px_rgba(103,160,213,0.12),0_20px_50px_-24px_rgba(36,77,122,0.82)]",
    activeNode:
      "border-[#25527d] bg-radial-[at_35%_30%] from-[#f7fbff] via-[#bedaf4] to-[#25527d] text-[#10253d]",
    contextNode:
      "border-[#bacde0] bg-radial-[at_35%_30%] from-white via-[#d9e7f5] to-[#97b6d2] text-[#486176]",
    chip: "border-[#25527d]/20 bg-[#eff6ff] text-[#25527d]",
  },
  UTILITY: {
    title: "Utilitaire",
    subtitle: "Mobilite, soutien, vision et outils",
    line: "#71b377",
    glow: "shadow-[0_0_0_10px_rgba(113,179,119,0.12),0_20px_50px_-24px_rgba(53,104,68,0.82)]",
    activeNode:
      "border-[#356844] bg-radial-[at_35%_30%] from-[#f8fff6] via-[#cde6c8] to-[#356844] text-[#16311c]",
    contextNode:
      "border-[#bdd4bf] bg-radial-[at_35%_30%] from-white via-[#e0edde] to-[#a1c2a4] text-[#4a634d]",
    chip: "border-[#356844]/20 bg-[#f0fbef] text-[#356844]",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function spellToNode(
  spell: CatalogueItem,
  matchedSlugs: Set<string>,
  spellMap: Map<string, CatalogueItem>,
): SpellNode {
  const category = spell.category ?? "UTILITY";
  const prerequisiteSlugs = spell.prerequisiteSlugs ?? [];

  return {
    ...spell,
    category,
    prerequisiteSlugs,
    prerequisiteNames: prerequisiteSlugs.map(
      (slug) => spellMap.get(slug)?.name ?? slug,
    ),
    matched: matchedSlugs.has(spell.slug),
    depth: 0,
  };
}

function computeDepth(
  node: SpellNode,
  nodeMap: Map<string, SpellNode>,
  cache: Map<string, number>,
  activePath = new Set<string>(),
): number {
  if (cache.has(node.slug)) {
    return cache.get(node.slug) ?? 0;
  }

  if (activePath.has(node.slug)) {
    return 0;
  }

  activePath.add(node.slug);

  const parentDepths: number[] = node.prerequisiteSlugs
    .map((slug) => nodeMap.get(slug))
    .filter((parent): parent is SpellNode => Boolean(parent))
    .map((parent) => computeDepth(parent, nodeMap, cache, activePath) + 1);

  activePath.delete(node.slug);

  const depth = parentDepths.length > 0 ? Math.max(...parentDepths) : 0;
  cache.set(node.slug, depth);
  return depth;
}

function buildCategoryLayout(
  category: SpellCategory,
  spells: CatalogueItem[],
  allSpells: CatalogueItem[],
): CategoryLayout {
  const spellMap = new Map(allSpells.map((spell) => [spell.slug, spell]));
  const matchedSlugs = new Set(spells.map((spell) => spell.slug));
  const visibleSlugs = new Set<string>();

  const includeAncestors = (slug: string) => {
    if (visibleSlugs.has(slug)) {
      return;
    }

    const spell = spellMap.get(slug);

    if (!spell || (spell.category ?? "UTILITY") !== category) {
      return;
    }

    visibleSlugs.add(slug);
    (spell.prerequisiteSlugs ?? []).forEach(includeAncestors);
  };

  spells
    .filter((spell) => (spell.category ?? "UTILITY") === category)
    .forEach((spell) => includeAncestors(spell.slug));

  const nodes = Array.from(visibleSlugs)
    .map((slug) => spellMap.get(slug))
    .filter((spell): spell is CatalogueItem => Boolean(spell))
    .map((spell) => spellToNode(spell, matchedSlugs, spellMap));

  const nodeMap = new Map(nodes.map((node) => [node.slug, node]));
  const depthCache = new Map<string, number>();

  nodes.forEach((node) => {
    node.depth = computeDepth(node, nodeMap, depthCache);
  });

  const columnsMap = new Map<number, SpellNode[]>();

  nodes.forEach((node) => {
    const columnNodes = columnsMap.get(node.depth) ?? [];
    columnNodes.push(node);
    columnsMap.set(node.depth, columnNodes);
  });

  const orderedDepths = Array.from(columnsMap.keys()).sort((a, b) => a - b);

  const positionedNodes = orderedDepths.flatMap((depth, columnIndex) =>
    (columnsMap.get(depth) ?? [])
      .sort((left, right) => {
        const leftLevel =
          levelRank[left.level ?? ""] ?? Number.MAX_SAFE_INTEGER;
        const rightLevel =
          levelRank[right.level ?? ""] ?? Number.MAX_SAFE_INTEGER;

        if (leftLevel !== rightLevel) {
          return leftLevel - rightLevel;
        }

        return left.name.localeCompare(right.name);
      })
      .map((node, rowIndex) => ({
        ...node,
        x: CATEGORY_START_X + columnIndex * COLUMN_GAP,
        y: CATEGORY_Y[category] + rowIndex * ROW_GAP,
      })),
  );

  const positionMap = new Map(positionedNodes.map((node) => [node.slug, node]));

  const edges = positionedNodes.flatMap((node) =>
    node.prerequisiteSlugs
      .filter((slug) => positionMap.has(slug))
      .map((slug) => ({ from: slug, to: node.slug })),
  );

  return {
    category,
    roots: positionedNodes.filter((node) => node.prerequisiteSlugs.length === 0)
      .length,
    nodes: positionedNodes,
    edges,
    anchor: {
      x: CATEGORY_START_X - 170,
      y: CATEGORY_Y[category],
    },
  };
}

function buildEdgePath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  startOffset = NODE_RADIUS - 6,
  endOffset = NODE_RADIUS - 6,
) {
  const startX = from.x + startOffset;
  const startY = from.y;
  const endX = to.x - endOffset;
  const endY = to.y;
  const curveX = startX + (endX - startX) / 2;

  return `M ${startX} ${startY} C ${curveX} ${startY}, ${curveX} ${endY}, ${endX} ${endY}`;
}

function buildScene(
  spells: CatalogueItem[],
  allSpells: CatalogueItem[],
): SpellScene {
  const categories = categoryOrder.map((category) =>
    buildCategoryLayout(category, spells, allSpells),
  );

  return {
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    hub: HUB_POSITION,
    categories,
  };
}

function SpellTree({ spells, allSpells }: SpellTreeProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const animateViewportRef = useRef<() => void>(() => {});
  const currentViewportRef = useRef<Viewport>({
    x: 0,
    y: 0,
    scale: 0.78,
  });
  const targetViewportRef = useRef<Viewport>({
    x: 0,
    y: 0,
    scale: 0.78,
  });
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    scale: 0.78,
  });
  const [isDragging, setIsDragging] = useState(false);

  const scene = useMemo(
    () => buildScene(spells, allSpells),
    [allSpells, spells],
  );

  useEffect(() => {
    animateViewportRef.current = () => {
      const current = currentViewportRef.current;
      const target = targetViewportRef.current;

      const next: Viewport = {
        x: current.x + (target.x - current.x) * 0.16,
        y: current.y + (target.y - current.y) * 0.16,
        scale: current.scale + (target.scale - current.scale) * 0.18,
      };

      const done =
        Math.abs(next.x - target.x) < 0.2 &&
        Math.abs(next.y - target.y) < 0.2 &&
        Math.abs(next.scale - target.scale) < 0.0015;

      const applied = done ? target : next;
      currentViewportRef.current = applied;
      setViewport(applied);

      if (done) {
        frameRef.current = null;
        return;
      }

      frameRef.current = window.requestAnimationFrame(
        animateViewportRef.current,
      );
    };
  }, []);

  const scheduleViewportAnimation = useCallback(() => {
    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(animateViewportRef.current);
  }, []);

  useEffect(() => {
    const element = viewportRef.current;

    if (!element) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const nextScale = clamp(bounds.width / scene.width, 0.62, 0.9);
    const nextX = bounds.width / 2 - scene.hub.x * nextScale + 50;
    const nextY = bounds.height / 2 - scene.hub.y * nextScale;

    const nextViewport = {
      x: nextX,
      y: nextY,
      scale: nextScale,
    };

    currentViewportRef.current = nextViewport;
    targetViewportRef.current = nextViewport;
    setViewport(nextViewport);
  }, [scene.height, scene.hub.x, scene.hub.y, scene.width]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [scheduleViewportAnimation]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragRef.current) {
        return;
      }

      const deltaX = event.clientX - dragRef.current.startX;
      const deltaY = event.clientY - dragRef.current.startY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        dragRef.current.moved = true;
        suppressClickRef.current = true;
      }

      targetViewportRef.current = {
        ...targetViewportRef.current,
        x: (dragRef.current?.originX ?? targetViewportRef.current.x) + deltaX,
        y: (dragRef.current?.originY ?? targetViewportRef.current.y) + deltaY,
      };
      scheduleViewportAnimation();
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      setIsDragging(false);

      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 80);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scheduleViewportAnimation]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: targetViewportRef.current.x,
      originY: targetViewportRef.current.y,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    const element = viewportRef.current;

    if (!element) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const cursorX = event.clientX - bounds.left;
    const cursorY = event.clientY - bounds.top;
    const delta = -event.deltaY * 0.0012;

    const current = targetViewportRef.current;
    const nextScale = clamp(current.scale * (1 + delta), MIN_SCALE, MAX_SCALE);
    const worldX = (cursorX - current.x) / current.scale;
    const worldY = (cursorY - current.y) / current.scale;

    targetViewportRef.current = {
      scale: nextScale,
      x: cursorX - worldX * nextScale,
      y: cursorY - worldY * nextScale,
    };
    scheduleViewportAnimation();
  };

  const zoom = (factor: number) => {
    const element = viewportRef.current;

    if (!element) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const cursorX = bounds.width / 2;
    const cursorY = bounds.height / 2;

    const current = targetViewportRef.current;
    const nextScale = clamp(current.scale * factor, MIN_SCALE, MAX_SCALE);
    const worldX = (cursorX - current.x) / current.scale;
    const worldY = (cursorY - current.y) / current.scale;

    targetViewportRef.current = {
      scale: nextScale,
      x: cursorX - worldX * nextScale,
      y: cursorY - worldY * nextScale,
    };
    scheduleViewportAnimation();
  };

  const resetView = () => {
    const element = viewportRef.current;

    if (!element) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const nextScale = clamp(bounds.width / scene.width, 0.62, 0.9);

    targetViewportRef.current = {
      scale: nextScale,
      x: bounds.width / 2 - scene.hub.x * nextScale + 50,
      y: bounds.height / 2 - scene.hub.y * nextScale,
    };
    scheduleViewportAnimation();
  };

  return (
    <div className="relative h-[calc(100vh-9rem)] min-h-195 overflow-hidden rounded-4xl border border-stone-800/70 bg-[#090c10] shadow-[0_32px_120px_-50px_rgba(0,0,0,0.75)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.10),transparent_30%),radial-gradient(circle_at_top_right,rgba(248,113,113,0.08),transparent_25%),radial-gradient(circle_at_bottom_center,rgba(74,222,128,0.08),transparent_30%)]" />

      <div className="pointer-events-none absolute left-5 top-5 z-20 max-w-sm rounded-3xl border border-white/10 bg-black/45 px-5 py-4 text-white backdrop-blur-xl">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-white/55">
          Grimoire
        </p>
        <h2 className="mt-2 font-[Vecna] text-4xl tracking-[0.08em]">
          Arbre des sorts
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/72">
          Maintiens le clic gauche pour deplacer la carte. Utilise la molette
          pour zoomer et dezoomer, puis clique un noeud pour ouvrir sa fiche.
        </p>
      </div>

      <div className="absolute bottom-5 right-5 z-20 flex flex-col gap-3">
        <button
          type="button"
          onClick={resetView}
          className="rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur transition hover:bg-black/70"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => zoom(1.15)}
          className="rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-lg font-semibold text-white backdrop-blur transition hover:bg-black/70"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => zoom(1 / 1.15)}
          className="rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-lg font-semibold text-white backdrop-blur transition hover:bg-black/70"
        >
          -
        </button>
      </div>

      <div
        ref={viewportRef}
        className={[
          "relative z-10 h-full w-full overflow-hidden",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        ].join(" ")}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: `${scene.width}px`,
            height: `${scene.height}px`,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
          }}
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-[linear-gradient(180deg,rgba(7,10,16,0.96),rgba(11,15,22,0.98))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.06),transparent_18%),radial-gradient(circle_at_48%_55%,rgba(255,255,255,0.04),transparent_14%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.05),transparent_20%)]" />

          <svg
            className="absolute left-0 top-0 h-full w-full"
            viewBox={`0 0 ${scene.width} ${scene.height}`}
            aria-hidden="true"
          >
            {scene.categories.map((category) => {
              const meta = categoryMeta[category.category];

              return (
                <g key={`path-${category.category}`}>
                  <path
                    d={buildEdgePath(scene.hub, category.anchor, 60, 12)}
                    fill="none"
                    stroke={meta.line}
                    strokeLinecap="round"
                    strokeOpacity={0.58}
                    strokeWidth={18}
                  />
                  <path
                    d={buildEdgePath(scene.hub, category.anchor, 60, 12)}
                    fill="none"
                    stroke="rgba(255,255,255,0.16)"
                    strokeLinecap="round"
                    strokeOpacity={0.45}
                    strokeWidth={4}
                  />

                  {category.edges.map((edge) => {
                    const from = category.nodes.find(
                      (node) => node.slug === edge.from,
                    );
                    const to = category.nodes.find(
                      (node) => node.slug === edge.to,
                    );

                    if (!from || !to) {
                      return null;
                    }

                    return (
                      <path
                        key={`${edge.from}-${edge.to}`}
                        d={buildEdgePath(from, to)}
                        fill="none"
                        stroke={meta.line}
                        strokeLinecap="round"
                        strokeOpacity={to.matched ? 0.9 : 0.38}
                        strokeWidth={to.matched ? 8 : 4}
                        strokeDasharray={to.matched ? undefined : "10 12"}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>

          <div
            className="absolute flex h-32 w-32 items-center justify-center rounded-full border border-white/15 bg-radial-[at_35%_30%] from-white via-[#d1d5db] to-[#4b5563] shadow-[0_0_0_14px_rgba(255,255,255,0.06),0_24px_60px_-22px_rgba(255,255,255,0.35)]"
            style={{
              left: `${scene.hub.x - 64}px`,
              top: `${scene.hub.y - 64}px`,
            }}
          >
            <div className="text-center text-[#111827]">
              <p className="mt-1 font-[Vecna] text-2xl tracking-widest">
                Magie
              </p>
            </div>
          </div>

          {scene.categories.map((category) => {
            const meta = categoryMeta[category.category];

            return (
              <div key={category.category}>
                {category.nodes.map((node) => (
                  <div
                    key={node.id}
                    className="absolute"
                    style={{
                      left: `${node.x - NODE_RADIUS}px`,
                      top: `${node.y - NODE_RADIUS}px`,
                      width: `${NODE_SIZE}px`,
                    }}
                  >
                    <NavLink
                      to={`/spells/${node.slug}`}
                      onClick={(event) => {
                        if (suppressClickRef.current) {
                          event.preventDefault();
                        }
                      }}
                      className="group block text-center"
                    >
                      <div
                        className={[
                          "mx-auto flex h-31 w-31 items-center justify-center rounded-full border-[3px] p-4 ring-1 ring-white/10 transition duration-200",
                          node.matched
                            ? `${meta.activeNode} ${meta.glow} hover:scale-[1.05]`
                            : `${meta.contextNode} opacity-75 hover:opacity-95`,
                        ].join(" ")}
                      >
                        <div className="space-y-1">
                          <p className="text-[0.55rem] font-semibold uppercase tracking-[0.24em] opacity-72">
                            {node.levelLabel ?? "Sort"}
                          </p>
                          <p className="line-clamp-3 font-serif text-sm leading-4">
                            {node.name}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 max-w-48 -translate-x-[1.15rem]">
                        <p
                          className={[
                            "text-sm font-semibold leading-5",
                            node.matched ? "text-white" : "text-white/55",
                          ].join(" ")}
                        ></p>
                      </div>
                    </NavLink>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SpellTree;
