import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MultiverseScene, NodeId } from "@/components/3d/MultiverseScene";
import { MiniMap, MusicToggle, ThemeToggle } from "@/components/overlay/Overlays";

const Index = () => {
  const [selected, setSelected] = useState<NodeId | null>("hub");
  const [musicOn, setMusicOn] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    document.title = "Multiverse Neural Portfolio | Full‑stack Dev";
  }, []);

  const nodes = useMemo(() => [
    { id: 'hub' as NodeId, label: 'Welcome' },
    { id: 'skills' as NodeId, label: 'Skills' },
    { id: 'projects' as NodeId, label: 'Projects' },
    { id: 'now' as NodeId, label: 'Now Building' },
    { id: 'collab' as NodeId, label: 'Collaborate' },
  ], []);

  return (
    <main className="min-h-screen relative">
      {/* SEO H1 */}
      <h1 className="sr-only">Multiverse Neural Portfolio — Full‑stack Dev | ML Enthusiast | Web3 Learner</h1>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Your Name",
            jobTitle: "Full-stack Developer",
            url: "/"
          }),
        }}
      />

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <MultiverseScene selected={selected} onSelect={setSelected} />
      </div>

      {/* Overlay UI */}
      <header className="pointer-events-none absolute top-0 inset-x-0 p-4 md:p-6 flex items-start justify-between">
        <div className="pointer-events-auto">
          <div className="text-sm text-muted-foreground">Your Name</div>
          <div className="text-xl md:text-2xl font-semibold gradient-text">Full‑stack Dev | ML Enthusiast | Web3 Learner</div>
        </div>
        <div className="pointer-events-auto flex items-center gap-4 bg-secondary/40 backdrop-blur rounded-lg px-3 py-2 border border-border">
          <ThemeToggle checked={dark} onChange={setDark} />
          <MusicToggle checked={musicOn} onChange={setMusicOn} />
        </div>
      </header>

      <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-3">
        <Button className="pointer-events-auto neon-ring" variant="default" onClick={() => setSelected('collab')}>Let’s Collaborate</Button>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4">
        <div className="pointer-events-auto"><MiniMap nodes={nodes} onJump={(id) => setSelected(id)} /></div>
      </div>
    </main>
  );
};

export default Index;
