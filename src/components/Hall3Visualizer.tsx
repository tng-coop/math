import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, Layers, RefreshCw } from 'lucide-react';

interface Point2D {
  x: number; // normalized [0, 1]
  y: number; // normalized [0, 1]
}

interface Hall3VisualizerProps {
  language: 'en' | 'ja';
  onlyVisualizer?: boolean;
}

type ProjectedItem =
  | {
      type: 'grid-line';
      id: string;
      pathData: string;
      color: string;
      strokeWidth: number;
      opacity: number;
      depth: number;
    }
  | {
      type: 'point';
      id: string;
      cx: number;
      cy: number;
      color: string;
      depth: number;
    };

export default function Hall3Visualizer({ language, onlyVisualizer = false }: Hall3VisualizerProps) {
  // Translations
  const t = useMemo(() => {
    const translations = {
      en: {
        roomTitle: "Exhibits / Hall 3: Quotient Topology",
        title: "The Quotient Torus",
        subtitle: "Folding a 2D sheet into a 3D manifold via boundary gluing",
        description1: "In topology, a quotient space is formed by gluing together points of a given space under an equivalence relation. Here, we start with a flat, two-dimensional square sheet and glue its opposite boundaries.",
        description2: "First, we glue the top boundary (Gold A) to the bottom boundary (Gold A) in the same direction. This forms a cylinder. Next, we glue the left boundary (Cyan B) to the right boundary (Cyan B), bending the cylinder to glue its circular ends. This yields a torus.",
        description3: "Move your cursor or tap over the 2D sheet to place a point. Observe its equivalence class: points on the boundaries or corners correspond to the exact same point in the glued quotient space. Watch them merge in 3D as the gluing stage increases.",
        gluingStage: "Gluing Stage",
        stage0: "0: Flat Sheet",
        stage1: "1: Cylinder",
        stage2: "2: Torus",
        playFolding: "Play Folding",
        pauseFolding: "Pause Folding",
        spin: "Auto-Rotation",
        reset: "Reset Point",
        equivalenceClass: "Equivalence Class",
        instruction: "Hover or tap on the 2D sheet to place a point",
        dragPrompt: "Drag 3D model to rotate manually",
        boundaryA: "Boundary A (Top & Bottom → Cylinder)",
        boundaryB: "Boundary B (Left & Right → Torus)",
      },
      ja: {
        roomTitle: "展示 / 第3室：商位相空間",
        title: "商空間としてのトーラス",
        subtitle: "境界の接着による2次元平面から3次元多様体への折り畳み",
        description1: "トポロジー（位相幾何学）において、商位相空間とは、与えられた空間の点を同値関係に基づいて「接着」することによって形成される空間です。ここでは、平らな2次元の正方形シートから始め、その対向する境界を接着します。",
        description2: "まず、上部境界（金色 A）と下部境界（金色 A）を同じ向きに接着します。これにより円柱が形成されます。次に、左側境界（シアン B）と右側境界（シアン B）を接着し、円柱を曲げてその両端の円を接着します。これによりトーラス（ドーナツ型）が得られます。",
        description3: "2Dシート上をホバーまたはタップすると、点とその同値類が表示されます。境界上やコーナーにある点は、接着された商空間においてまったく同一の点に対応します。接着ステージを進めると、それらが3D空間で1つに融合していく様子を観察できます。",
        gluingStage: "接着ステージ",
        stage0: "0: 平らなシート",
        stage1: "1: 円柱",
        stage2: "2: トーラス",
        playFolding: "折り畳みを再生",
        pauseFolding: "一時停止",
        spin: "自動回転",
        reset: "点をリセット",
        equivalenceClass: "同値類",
        instruction: "2Dシート上をホバーまたはタップして点を配置してください",
        dragPrompt: "3Dモデルをドラッグして回転できます",
        boundaryA: "境界 A (上下接着 → 円柱)",
        boundaryB: "境界 B (左右接着 → トーラス)",
      }
    };
    return translations[language];
  }, [language]);

  // Visualizer States
  const [gluingStage, setGluingStage] = useState<number>(0.0); // t from 0 to 2
  const [activePoint, setActivePoint] = useState<Point2D | null>({ x: 0.5, y: 0.5 });
  const [isFolding, setIsFolding] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Rotation angles (rx = pitch/X-rotation, ry = yaw/Y-rotation, rz = roll/Z-rotation)
  // Default values to give a nice 3D view on startup
  const [rotationAngle, setRotationAngle] = useState({
    x: -0.4,
    y: 0.6,
    z: 0.0,
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Animation Loop (auto-rotation and auto-folding)
  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000; // in seconds
      lastTime = time;

      if (isFolding) {
        setGluingStage((prev) => {
          let next = prev + delta * 0.35; // take about 5.7s for full fold cycle
          if (next >= 2.0) {
            next = 0.0;
          }
          return next;
        });
      }

      if (isRotating) {
        setRotationAngle((prev) => ({
          x: prev.x,
          y: (prev.y + delta * 0.25) % (2 * Math.PI),
          z: (prev.z + delta * 0.1) % (2 * Math.PI),
        }));
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isFolding, isRotating]);

  // Snapping and placement logic for 2D representation
  const handle2DPointer = (
    e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // 2D sheet is placed at (20, 20) with width=240, height=240 in SVG
    const px = clientX - rect.left - 20;
    const py = clientY - rect.top - 20;

    // Clamp coordinates to the sheet area [0, 240]
    const cx = Math.max(0, Math.min(240, px));
    const cy = Math.max(0, Math.min(240, py));

    let x = cx / 240;
    let y = cy / 240;

    // Boundary Snapping: if close to boundaries, snap to edges to help show equivalence class
    const SNAP_THRESHOLD_PX = 8;
    if (cx < SNAP_THRESHOLD_PX) {
      x = 0;
    } else if (cx > 240 - SNAP_THRESHOLD_PX) {
      x = 1;
    }

    if (cy < SNAP_THRESHOLD_PX) {
      y = 0;
    } else if (cy > 240 - SNAP_THRESHOLD_PX) {
      y = 1;
    }

    setActivePoint({ x, y });
  };

  // Drag-to-rotate handlers for the 3D model
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    setRotationAngle((prev) => ({
      x: (prev.x + dy * 0.007) % (2 * Math.PI),
      y: (prev.y + dx * 0.007) % (2 * Math.PI),
      z: prev.z,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setRotationAngle((prev) => ({
      x: (prev.x + dy * 0.007) % (2 * Math.PI),
      y: (prev.y + dx * 0.007) % (2 * Math.PI),
      z: prev.z,
    }));
  };

  // Convert normalized [0, 1] points to 2D SVG canvas [20, 260] coords
  const toSVGCoords = (x: number, y: number) => {
    return {
      cx: 20 + x * 240,
      cy: 20 + y * 240,
    };
  };

  // Compute Equivalence Class on the Torus
  // (x, y) coordinates glued on borders: (x, 0) ~ (x, 1) and (0, y) ~ (1, y)
  const getEquivalenceClass = (x: number, y: number): Point2D[] => {
    const isLeft = x === 0;
    const isRight = x === 1;
    const isTop = y === 0;
    const isBottom = y === 1;

    // Corner cases: all 4 corners represent the exact same quotient point
    if ((isLeft || isRight) && (isTop || isBottom)) {
      return [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];
    }
    // Left/Right boundaries glue to each other
    if (isLeft || isRight) {
      return [
        { x: 0, y },
        { x: 1, y },
      ];
    }
    // Top/Bottom boundaries glue to each other
    if (isTop || isBottom) {
      return [
        { x, y: 0 },
        { x, y: 1 },
      ];
    }
    // Interior points have a singleton equivalence class
    return [{ x, y }];
  };

  // Render equivalence connection lines on 2D sheet
  const renderEquivalenceLines = () => {
    if (!activePoint) return null;
    const { x, y } = activePoint;

    const isLeft = x === 0;
    const isRight = x === 1;
    const isTop = y === 0;
    const isBottom = y === 1;

    const leftX = 20;
    const rightX = 260;
    const topY = 20;
    const bottomY = 260;

    const curX = 20 + x * 240;
    const curY = 20 + y * 240;

    if ((isLeft || isRight) && (isTop || isBottom)) {
      return (
        <>
          <line x1={leftX} y1={topY} x2={rightX} y2={topY} stroke="#d4af37" strokeDasharray="3 3" strokeWidth="1.5" />
          <line x1={leftX} y1={bottomY} x2={rightX} y2={bottomY} stroke="#d4af37" strokeDasharray="3 3" strokeWidth="1.5" />
          <line x1={leftX} y1={topY} x2={leftX} y2={bottomY} stroke="#38bdf8" strokeDasharray="3 3" strokeWidth="1.5" />
          <line x1={rightX} y1={topY} x2={rightX} y2={bottomY} stroke="#38bdf8" strokeDasharray="3 3" strokeWidth="1.5" />
        </>
      );
    }

    if (isLeft || isRight) {
      return (
        <line
          x1={leftX}
          y1={curY}
          x2={rightX}
          y2={curY}
          stroke="#38bdf8"
          strokeDasharray="4 4"
          strokeWidth="1.5"
          opacity="0.8"
        />
      );
    }

    if (isTop || isBottom) {
      return (
        <line
          x1={curX}
          y1={topY}
          x2={curX}
          y2={bottomY}
          stroke="#d4af37"
          strokeDasharray="4 4"
          strokeWidth="1.5"
          opacity="0.8"
        />
      );
    }

    return null;
  };

  // Math: 3D coordinates calculation with interpolation
  const getInterpolatedCoords = (x: number, y: number, t: number) => {
    // 1. Flat Sheet
    const xFlat = (x - 0.5) * 160;
    const yFlat = (y - 0.5) * 160;
    const zFlat = 0;

    // 2. Cylinder
    const rCyl = 160 / (2 * Math.PI);
    const theta = 2 * Math.PI * y - Math.PI;
    const xCyl = rCyl * Math.cos(theta);
    const yCyl = (x - 0.5) * 160;
    const zCyl = rCyl * Math.sin(theta);

    // 3. Torus
    const R = 160 / (2 * Math.PI);
    const r = rCyl;
    const phi = 2 * Math.PI * x - Math.PI;
    const xTor = (R + r * Math.cos(theta)) * Math.cos(phi);
    const yTor = (R + r * Math.cos(theta)) * Math.sin(phi);
    const zTor = r * Math.sin(theta);

    if (t <= 1) {
      // Interpolate Flat -> Cylinder
      const s = t;
      return {
        x: (1 - s) * xFlat + s * xCyl,
        y: (1 - s) * yFlat + s * yCyl,
        z: (1 - s) * zFlat + s * zCyl,
      };
    } else {
      // Interpolate Cylinder -> Torus
      const s = t - 1;
      return {
        x: (1 - s) * xCyl + s * xTor,
        y: (1 - s) * yCyl + s * yTor,
        z: (1 - s) * zCyl + s * zTor,
      };
    }
  };

  // Math: Rotate point in 3D
  const rotate3D = (
    x: number,
    y: number,
    z: number,
    rx: number,
    ry: number,
    rz: number
  ) => {
    // Rotate around X-axis
    const x1 = x;
    const y1 = y * Math.cos(rx) - z * Math.sin(rx);
    const z1 = y * Math.sin(rx) + z * Math.cos(rx);

    // Rotate around Y-axis
    const x2 = x1 * Math.cos(ry) + z1 * Math.sin(ry);
    const y2 = y1;
    const z2 = -x1 * Math.sin(ry) + z1 * Math.cos(ry);

    // Rotate around Z-axis
    const x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
    const y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
    const z3 = z2;

    return { x: x3, y: y3, z: z3 };
  };

  // Math: 3D perspective projection
  const project = (x: number, y: number, z: number) => {
    const D = 320; // Camera distance
    const scale = 2.0; // Viewport scaling multiplier
    const factor = D / (D - z);
    return {
      u: x * factor * scale,
      v: y * factor * scale,
    };
  };

  // Build and depth-sort 3D elements (grid lines + points)
  const projectedItems = useMemo(() => {
    const items: ProjectedItem[] = [];

    const stepsX = 13; // number of longitudinal grid lines
    const stepsY = 13; // number of latitudinal grid lines
    const sampleSteps = 40; // smoothness of lines

    // 1. Longitudinal grid lines (constant x, varying y)
    for (let i = 0; i < stepsX; i++) {
      const x = i / (stepsX - 1);
      const isLeft = i === 0;
      const isRight = i === stepsX - 1;

      let color = 'rgba(192, 132, 252, 0.22)';
      let strokeWidth = 1.0;
      if (isLeft || isRight) {
        color = '#38bdf8'; // Cyan boundary B
        strokeWidth = 2.2;
      }

      const pts: { u: number; v: number; zRot: number }[] = [];
      for (let j = 0; j < sampleSteps; j++) {
        const y = j / (sampleSteps - 1);
        const coords = getInterpolatedCoords(x, y, gluingStage);
        const rot = rotate3D(coords.x, coords.y, coords.z, rotationAngle.x, rotationAngle.y, rotationAngle.z);
        const proj = project(rot.x, rot.y, rot.z);
        pts.push({ u: proj.u, v: proj.v, zRot: rot.z });
      }

      const avgDepth = pts.reduce((sum, p) => sum + p.zRot, 0) / pts.length;
      let pathData = `M ${pts[0].u.toFixed(1)} ${pts[0].v.toFixed(1)}`;
      for (let j = 1; j < pts.length; j++) {
        pathData += ` L ${pts[j].u.toFixed(1)} ${pts[j].v.toFixed(1)}`;
      }

      items.push({
        type: 'grid-line',
        id: `grid-x-${i}`,
        pathData,
        color,
        strokeWidth,
        opacity: (isLeft || isRight) ? 0.95 : 0.45,
        depth: avgDepth,
      });
    }

    // 2. Latitudinal grid lines (constant y, varying x)
    for (let i = 0; i < stepsY; i++) {
      const y = i / (stepsY - 1);
      const isTop = i === 0;
      const isBottom = i === stepsY - 1;

      let color = 'rgba(192, 132, 252, 0.22)';
      let strokeWidth = 1.0;
      if (isTop || isBottom) {
        color = '#d4af37'; // Gold boundary A
        strokeWidth = 2.2;
      }

      const pts: { u: number; v: number; zRot: number }[] = [];
      for (let j = 0; j < sampleSteps; j++) {
        const x = j / (sampleSteps - 1);
        const coords = getInterpolatedCoords(x, y, gluingStage);
        const rot = rotate3D(coords.x, coords.y, coords.z, rotationAngle.x, rotationAngle.y, rotationAngle.z);
        const proj = project(rot.x, rot.y, rot.z);
        pts.push({ u: proj.u, v: proj.v, zRot: rot.z });
      }

      const avgDepth = pts.reduce((sum, p) => sum + p.zRot, 0) / pts.length;
      let pathData = `M ${pts[0].u.toFixed(1)} ${pts[0].v.toFixed(1)}`;
      for (let j = 1; j < pts.length; j++) {
        pathData += ` L ${pts[j].u.toFixed(1)} ${pts[j].v.toFixed(1)}`;
      }

      items.push({
        type: 'grid-line',
        id: `grid-y-${i}`,
        pathData,
        color,
        strokeWidth,
        opacity: (isTop || isBottom) ? 0.95 : 0.45,
        depth: avgDepth,
      });
    }

    // 3. Highlighted equivalent points projected in 3D
    if (activePoint) {
      const equivPoints = getEquivalenceClass(activePoint.x, activePoint.y);
      equivPoints.forEach((pt, idx) => {
        const coords = getInterpolatedCoords(pt.x, pt.y, gluingStage);
        const rot = rotate3D(coords.x, coords.y, coords.z, rotationAngle.x, rotationAngle.y, rotationAngle.z);
        const proj = project(rot.x, rot.y, rot.z);

        items.push({
          type: 'point',
          id: `point-equiv-${idx}`,
          cx: proj.u,
          cy: proj.v,
          color: '#d4af37',
          depth: rot.z,
        });
      });
    }

    // Sort items by depth (ascending: painter's algorithm renders back elements first)
    items.sort((a, b) => a.depth - b.depth);

    return items;
  }, [gluingStage, rotationAngle, activePoint]);

  // Inject stylesheet for keyframe animations
  const styleSheet = `
    @keyframes pulse-2d {
      0% { r: 4px; opacity: 0.9; }
      100% { r: 14px; opacity: 0; }
    }
    @keyframes pulse-3d {
      0% { r: 5px; opacity: 0.9; }
      100% { r: 18px; opacity: 0; }
    }
    .pulse-circle-2d {
      animation: pulse-2d 1.6s cubic-bezier(0.25, 0, 0, 1) infinite;
    }
    .pulse-circle-3d {
      animation: pulse-3d 1.6s cubic-bezier(0.25, 0, 0, 1) infinite;
    }
    .slider-stage-label {
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    .slider-stage-label:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--primary);
    }
  `;

  return (
    <div className="visualizer-container animate-pop-in">
      <style dangerouslySetInnerHTML={{ __html: styleSheet }} />

      <div className="exhibit-grid">
        {/* Left Side: Placard & Interactive 2D Sheet */}
        <div className="placard-panel">
          {!onlyVisualizer && (
            <div>
              <div className="placard-header">
                <span>{t.roomTitle}</span>
              </div>
              <h2 className="placard-title">{t.title}</h2>
              <h3 className="placard-subtitle">{t.subtitle}</h3>

              <div className="placard-text" style={{ fontSize: '0.85rem' }}>
                <p>{t.description1}</p>
                <p>{t.description2}</p>
                <p>{t.description3}</p>
              </div>
            </div>
          )}

          {/* Interactive 2D Sheet representation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.25rem', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--primary)', fontWeight: 'bold' }}>
              {t.instruction}
            </div>

            <div style={{ position: 'relative', background: 'rgba(10, 15, 30, 0.45)', borderRadius: '1rem', border: '1px solid rgba(212,175,55,0.15)', padding: '0.75rem' }}>
              <svg
                width="280"
                height="280"
                viewBox="0 0 280 280"
                style={{ cursor: 'crosshair', touchAction: 'none' }}
                onMouseMove={handle2DPointer}
                onMouseDown={handle2DPointer}
                onTouchStart={handle2DPointer}
                onTouchMove={handle2DPointer}
              >
                {/* 2D Sheet surface */}
                <rect x="20" y="20" width="240" height="240" fill="rgba(15, 23, 42, 0.6)" stroke="rgba(255,255,255,0.03)" />
                
                {/* 2D Grid markings */}
                {Array.from({ length: 9 }).map((_, i) => {
                  const pos = 20 + (i + 1) * 24;
                  return (
                    <g key={i}>
                      <line x1={pos} y1="20" x2={pos} y2="260" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="20" y1={pos} x2="260" y2={pos} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    </g>
                  );
                })}

                {/* Dashed lines connecting equivalence classes */}
                {renderEquivalenceLines()}

                {/* Boundaries */}
                {/* Top: A (Gold) */}
                <line x1="20" y1="20" x2="260" y2="20" stroke="#d4af37" strokeWidth="3" />
                {/* Bottom: A (Gold) */}
                <line x1="20" y1="260" x2="260" y2="260" stroke="#d4af37" strokeWidth="3" />
                {/* Left: B (Cyan) */}
                <line x1="20" y1="20" x2="20" y2="260" stroke="#38bdf8" strokeWidth="3" />
                {/* Right: B (Cyan) */}
                <line x1="260" y1="20" x2="260" y2="260" stroke="#38bdf8" strokeWidth="3" />

                {/* Gluing Direction Arrowheads */}
                {/* Top/Bottom pointing right */}
                <polygon points="136,16 144,20 136,24" fill="#d4af37" />
                <polygon points="136,256 144,260 136,264" fill="#d4af37" />
                {/* Left/Right pointing up */}
                <polygon points="16,144 20,136 24,144" fill="#38bdf8" />
                <polygon points="256,144 260,136 264,144" fill="#38bdf8" />

                {/* Boundary Labels */}
                <text x="150" y="14" fill="#d4af37" fontSize="10" fontWeight="bold" textAnchor="middle">A</text>
                <text x="150" y="274" fill="#d4af37" fontSize="10" fontWeight="bold" textAnchor="middle">A</text>
                <text x="8" y="144" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">B</text>
                <text x="272" y="144" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">B</text>

                {/* Equivalence points render */}
                {activePoint && getEquivalenceClass(activePoint.x, activePoint.y).map((pt, idx) => {
                  const { cx, cy } = toSVGCoords(pt.x, pt.y);
                  return (
                    <g key={idx}>
                      <circle cx={cx} cy={cy} className="pulse-circle-2d" fill="#d4af37" />
                      <circle cx={cx} cy={cy} r="4.5" fill="#d4af37" stroke="#ffffff" strokeWidth="1" />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Boundary Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.68rem', color: 'var(--text-muted)', width: '100%', maxWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '14px', height: '3px', background: '#d4af37' }}></div>
                <span>{t.boundaryA}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '14px', height: '3px', background: '#38bdf8' }}></div>
                <span>{t.boundaryB}</span>
              </div>
              {activePoint && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', color: 'var(--primary)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37', display: 'inline-block' }}></span>
                  <span>
                    {t.equivalenceClass}: {getEquivalenceClass(activePoint.x, activePoint.y).length} {language === 'en' ? 'point(s)' : '個の点の集合'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {!onlyVisualizer && (
            <div className="placard-footer">
              <span>ONTOLOGY MUSEUM</span>
              <span>ROOM 03</span>
            </div>
          )}
        </div>

        {/* Right Side: Kiosk (3D Model Projection Viewer) */}
        <div className="kiosk-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          {/* Section title */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--primary)', textTransform: 'uppercase' }}>
                {language === 'en' ? '3D Folding Transformation' : '3D折り畳み同相写像'}
              </h4>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {t.dragPrompt}
              </p>
            </div>
          </div>

          {/* 3D SVG Projection Arena */}
          <div style={{ flexGrow: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, padding: '0.5rem 0' }}>
            <svg
              viewBox="-250 -250 500 500"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '430px',
                background: 'radial-gradient(circle at center, rgba(16, 24, 48, 0.45) 0%, rgba(5, 7, 12, 0.88) 100%)',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              {/* Depth-sorted rendering of projected elements */}
              {projectedItems.map((item) => {
                if (item.type === 'grid-line') {
                  const minDepth = -80;
                  const maxDepth = 80;
                  const normDepth = Math.max(0, Math.min(1, (item.depth - minDepth) / (maxDepth - minDepth)));
                  const opacity = item.opacity * (0.3 + 0.7 * normDepth);
                  const strokeWidth = item.strokeWidth * (0.6 + 0.8 * normDepth);

                  return (
                    <path
                      key={item.id}
                      d={item.pathData}
                      fill="none"
                      stroke={item.color}
                      strokeWidth={strokeWidth}
                      strokeOpacity={opacity}
                      style={{ transition: 'stroke 0.3s ease' }}
                    />
                  );
                } else {
                  // Projected equivalent point(s)
                  const minDepth = -80;
                  const maxDepth = 80;
                  const normDepth = Math.max(0, Math.min(1, (item.depth - minDepth) / (maxDepth - minDepth)));
                  const size = 6.0 * (0.75 + 0.55 * normDepth);
                  const opacity = 0.55 + 0.45 * normDepth;

                  return (
                    <g key={item.id}>
                      <circle
                        cx={item.cx}
                        cy={item.cy}
                        className="pulse-circle-3d"
                        fill="#d4af37"
                        fillOpacity={opacity * 0.4}
                      />
                      <circle
                        cx={item.cx}
                        cy={item.cy}
                        r={size}
                        fill="#d4af37"
                        stroke="#ffffff"
                        strokeWidth="1.2"
                        fillOpacity={opacity}
                        strokeOpacity={opacity}
                      />
                    </g>
                  );
                }
              })}
            </svg>
          </div>

          {/* Interactive Slider */}
          <div style={{ width: '100%', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              <span>{t.gluingStage}</span>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                {gluingStage.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={gluingStage}
              onChange={(e) => {
                setGluingStage(parseFloat(e.target.value));
                setIsFolding(false); // Pause auto fold on user interaction
              }}
              style={{
                width: '100%',
                accentColor: 'var(--primary)',
                background: 'rgba(255, 255, 255, 0.1)',
                height: '6px',
                borderRadius: '3px',
                outline: 'none',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              <span
                className="slider-stage-label"
                style={{
                  color: gluingStage === 0 ? 'var(--primary)' : 'inherit',
                  fontWeight: gluingStage === 0 ? 'bold' : 'normal',
                }}
                onClick={() => {
                  setGluingStage(0);
                  setIsFolding(false);
                }}
              >
                {t.stage0}
              </span>
              <span
                className="slider-stage-label"
                style={{
                  color: gluingStage >= 0.95 && gluingStage <= 1.05 ? 'var(--primary)' : 'inherit',
                  fontWeight: gluingStage >= 0.95 && gluingStage <= 1.05 ? 'bold' : 'normal',
                }}
                onClick={() => {
                  setGluingStage(1);
                  setIsFolding(false);
                }}
              >
                {t.stage1}
              </span>
              <span
                className="slider-stage-label"
                style={{
                  color: gluingStage === 2 ? 'var(--primary)' : 'inherit',
                  fontWeight: gluingStage === 2 ? 'bold' : 'normal',
                }}
                onClick={() => {
                  setGluingStage(2);
                  setIsFolding(false);
                }}
              >
                {t.stage2}
              </span>
            </div>
          </div>

          {/* Action Control Panel */}
          <div style={{ display: 'flex', gap: '0.75rem', width: '100%', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button
              className="btn btn-secondary"
              style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minWidth: '120px' }}
              onClick={() => setIsFolding(!isFolding)}
            >
              {isFolding ? <Pause size={14} /> : <Play size={14} />}
              <span>{isFolding ? t.pauseFolding : t.playFolding}</span>
            </button>

            <button
              className="btn"
              style={{
                flex: '1 1 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                minWidth: '120px',
                background: isRotating ? 'rgba(212, 175, 55, 0.12)' : 'rgba(56, 189, 248, 0.08)',
                border: isRotating ? '1px solid var(--primary)' : '1px solid rgba(56, 189, 248, 0.25)',
                color: isRotating ? 'var(--primary)' : 'var(--secondary)',
              }}
              onClick={() => setIsRotating(!isRotating)}
            >
              <Layers size={14} />
              <span>{t.spin}</span>
            </button>

            <button
              className="btn btn-secondary"
              style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minWidth: '100px' }}
              onClick={() => setActivePoint(null)}
            >
              <RefreshCw size={14} />
              <span>{t.reset}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
