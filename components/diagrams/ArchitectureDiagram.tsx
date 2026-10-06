type Tone = "default" | "agent" | "accent";

type Node = { id: string; x: number; y: number; w: number; h: number; tone?: Tone };

type Layout = { height: number; nodes: Node[]; edges: string[] };

const WIDTH = 640;

// Node order and edges follow the flows in spec 3.3.4.
const layouts = {
  b2b: {
    height: 340,
    nodes: [
      { id: "enrichment", x: 230, y: 20, w: 180, h: 52 },
      { id: "telegram", x: 20, y: 144, w: 150, h: 52 },
      { id: "agent", x: 230, y: 134, w: 180, h: 72, tone: "agent" },
      { id: "supabase", x: 470, y: 144, w: 150, h: 52 },
      { id: "scheduler", x: 20, y: 268, w: 210, h: 52 },
    ],
    edges: ["M170 170H226", "M410 170H466", "M95 268V200", "M320 72V130"],
  },
  esteticaah: {
    height: 320,
    nodes: [
      { id: "site", x: 20, y: 40, w: 170, h: 64 },
      { id: "typebot", x: 245, y: 46, w: 150, h: 52 },
      { id: "n8n", x: 450, y: 46, w: 170, h: 52 },
      { id: "claude", x: 430, y: 230, w: 190, h: 52, tone: "agent" },
      { id: "whatsapp", x: 130, y: 230, w: 240, h: 52, tone: "accent" },
    ],
    edges: ["M190 72H241", "M395 72H446", "M535 98V226", "M430 256H374"],
  },
} satisfies Record<string, Layout>;

export type DiagramVariant = keyof typeof layouts;

const stroke: Record<Tone, string> = {
  default: "var(--border)",
  agent: "var(--accent-2)",
  accent: "var(--accent)",
};

type Props = {
  variant: DiagramVariant;
  label: string;
  nodeLabels: Record<string, string[]>;
};

export function ArchitectureDiagram({ variant, label, nodeLabels }: Props) {
  const layout: Layout = layouts[variant];
  const markerId = `arrow-${variant}`;

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${WIDTH} ${layout.height}`}
      width={WIDTH}
      height={layout.height}
      className="h-auto w-full min-w-[30rem] font-mono"
    >
      <defs>
        <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 8 4 0 8Z" fill="var(--muted)" />
        </marker>
      </defs>

      {layout.edges.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="1.5"
          markerEnd={`url(#${markerId})`}
        />
      ))}

      {layout.nodes.map((node) => {
        const lines = nodeLabels[node.id] ?? [node.id];
        const centerY = node.y + node.h / 2;
        const firstLineY = centerY - (lines.length - 1) * 10;

        return (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              rx="10"
              fill="var(--surface)"
              stroke={stroke[node.tone ?? "default"]}
              strokeWidth="1.5"
            />
            {lines.map((line, i) => (
              <text
                key={line}
                x={node.x + node.w / 2}
                y={firstLineY + i * 20}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={i === 0 ? 14 : 12}
                fill={i === 0 ? "var(--text)" : "var(--muted)"}
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
