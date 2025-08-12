type NodeId = 'hub' | 'skills' | 'projects' | 'now' | 'collab'

export function Typewriter({ lines }: { lines: string[] }) {
  // Simple static fallback for now (we use 3D Html for main text). Can be extended.
  return (
    <div className="space-y-1">
      {lines.map((l, i) => (
        <p key={i} className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: `${i * 80}ms` } as any}>
          {l}
        </p>
      ))}
    </div>
  )
}

export function MiniMap({ nodes, onJump }: { nodes: { id: NodeId; label: string }[]; onJump: (id: NodeId) => void }) {
  return (
    <div className="bg-secondary/50 backdrop-blur rounded-lg p-3 border border-border">
      <div className="text-xs mb-2 text-muted-foreground">Quick Jump</div>
      <div className="grid grid-cols-2 gap-2">
        {nodes.map((n) => (
          <button
            key={n.id}
            onClick={() => onJump(n.id)}
            className="flex items-center gap-2 px-2 py-1 rounded-md bg-background/60 border border-border hover-scale"
            aria-label={`Jump to ${n.label}`}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--gradient-primary)' } as any} />
            <span className="text-xs">{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function ThemeToggle({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="appearance-none h-5 w-9 bg-secondary rounded-full relative transition-colors"
        style={{ boxShadow: 'inset 0 0 0 2px hsl(var(--border))' } as any}
      />
      <span>Theme</span>
    </label>
  )
}

export function MusicToggle({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="appearance-none h-5 w-9 bg-secondary rounded-full relative transition-colors"
        style={{ boxShadow: 'inset 0 0 0 2px hsl(var(--border))' } as any}
      />
      <span>Music</span>
    </label>
  )
}
