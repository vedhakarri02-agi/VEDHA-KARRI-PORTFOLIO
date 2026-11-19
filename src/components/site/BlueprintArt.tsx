// Botanical & Agronomic scientific vector art used where no photo has been uploaded yet:
// Growth rings, leaf venation geometry, solar azimuth arc, and soil strata markers.

type Props = {
  /** Text in the centre, e.g. initials or project code. */
  label?: string;
  variant?: number;
  className?: string;
  animate?: boolean;
};

export function BlueprintArt({ label, variant = 0, className, animate = false }: Props) {
  const rotation = (variant * 23) % 90;

  return (
    <svg
      viewBox="0 0 400 400"
      className={`${className ?? ''} ${animate ? 'draw-lines' : ''}`}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
    >
      {/* Precision coordinate grid */}
      <g strokeWidth="0.8" strokeDasharray="6 6" opacity="0.35">
        <line x1="40" y1="200" x2="360" y2="200" />
        <line x1="200" y1="40" x2="200" y2="360" />
      </g>

      {/* Outer concentric growth rings (representing tree canopy & soil radius) */}
      <g strokeWidth="1.4">
        <circle cx="200" cy="200" r="160" opacity="0.25" strokeDasharray="4 8" />
        <circle cx="200" cy="200" r="135" opacity="0.5" />
        <circle cx="200" cy="200" r="105" opacity="0.75" />
        <circle cx="200" cy="200" r="75" strokeWidth="1.8" />
      </g>

      {/* Botanical leaf geometry & cellular node petals */}
      <g transform={`rotate(${rotation} 200 200)`} opacity="0.85">
        {/* Leaf contour path 1 */}
        <path
          d="M 200 85 C 260 140 260 260 200 315 C 140 260 140 140 200 85 Z"
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Leaf central vein */}
        <line x1="200" y1="85" x2="200" y2="315" strokeWidth="1.2" strokeDasharray="8 4" opacity="0.7" />

        {/* Lateral veins */}
        <line x1="200" y1="140" x2="235" y2="120" strokeWidth="1" opacity="0.5" />
        <line x1="200" y1="140" x2="165" y2="120" strokeWidth="1" opacity="0.5" />
        <line x1="200" y1="180" x2="245" y2="160" strokeWidth="1" opacity="0.5" />
        <line x1="200" y1="180" x2="155" y2="160" strokeWidth="1" opacity="0.5" />
        <line x1="200" y1="220" x2="240" y2="205" strokeWidth="1" opacity="0.5" />
        <line x1="200" y1="220" x2="160" y2="205" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Precision GIS telemetry compass ticks */}
      <g strokeWidth="1.2" opacity="0.6">
        <circle cx="200" cy="200" r="172" strokeDasharray="2 12" />
        <text x="200" y="24" textAnchor="middle" fill="currentColor" stroke="none" fontSize="10" fontFamily="var(--font-mono)">
          N 18°46′
        </text>
        <text x="382" y="204" textAnchor="middle" fill="currentColor" stroke="none" fontSize="10" fontFamily="var(--font-mono)">
          E 84°25′
        </text>
      </g>

      {/* Soil health / scientific indicator label */}
      <g strokeWidth="1" opacity="0.8">
        <line x1="80" y1="365" x2="320" y2="365" />
        <circle cx="80" cy="365" r="3" fill="currentColor" />
        <circle cx="320" cy="365" r="3" fill="currentColor" />
        <text
          x="200"
          y="382"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="11"
          fontFamily="var(--font-mono)"
          letterSpacing="0.1em"
        >
          BIO-AGRONOMY · AGRI-SCIENTIFIC
        </text>
      </g>

      {label && (
        <text
          x="200"
          y="200"
          textAnchor="middle"
          dominantBaseline="central"
          fill="currentColor"
          stroke="none"
          fontSize={label.length <= 3 ? 34 : 20}
          fontFamily="var(--font-display)"
          fontWeight="600"
          letterSpacing="0.05em"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
