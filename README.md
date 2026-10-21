# Cairn — Browser Fleet Console & Chromium Internals

> Concept demo prepared for Chromium infrastructure, automation, and browser-internals engineering.

Cairn is a two-part interactive demo: an editorial site plus a high-fidelity browser-fleet console. It models Chromium multi-process architecture, networking service IPC, rendering pipelines, memory exhaustion diagnostics (`/dev/shm` SIGBUS), and downstream patch rebase workflows.

---

## 🏛️ Architectural Concepts Demonstrated

1. **Multi-Process Supervision**:
   - Live SVG model of Chromium's architecture: Browser supervisor, sandboxed Network service, GPU compositor, and site-isolated Renderers.
   - Fault simulation: renderer crashes with site-isolation recovery, network queue stalls, and software rasterizer fallbacks.

2. **Session Traces & Internals**:
   - 5 synchronized swimlanes: CDP commands, Browser frame host, Network service sockets, Renderer Blink main thread, and GPU compositor.
   - Shared memory counter curve showing the exact moment memory touches a 64 MB container limit, triggering `SIGBUS`.
   - Side-by-side comparison against bare-metal baselines.

3. **Consistency Lab**:
   - Cross-environment layer-by-layer comparison (Network, Navigator, Rendering, Fonts, Locale, Automation Surface).
   - Detection lens distinguishing the 9 behavioral differences that alter execution from 28 cosmetic artifacts.

4. **Builds & Patch Management**:
   - Downstream patch stack sitting on upstream Chromium milestones.
   - 6-step interactive rebase workflow (`M146` to `M147`): conflict detection, pseudocode merge resolution, streaming build logs, verification test runners, and artifact packaging with checksums.

5. **Case File 014**:
   - Long-form engineering investigation into containerized `/dev/shm` shared memory exhaustion, structured hypothesis testing board, and resolution metrics.

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript, Vite
- **Routing**: React Router (code-split lazy chunks)
- **State Management**: Zustand
- **Visuals & Charts**: Hand-crafted SVG driven by D3 math (`d3-scale`, `d3-shape`)
- **Styling**: Vanilla CSS tokens mapped to modern layout patterns
- **Typography**: Newsreader (editorial serif), Hanken Grotesk (interface sans), IBM Plex Mono (monospaced telemetry)

---

## 🚀 Getting Started

### Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173/`.

### Production Build

```bash
npm run build
npm run preview
```

Output is compiled to the static `dist/` directory.

---

## ☁️ Deployment (Netlify)

This repository includes a ready-to-deploy `netlify.toml` with:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA client-side rewrite rule: `/* -> /index.html 200`
- Cache and security headers for static assets

---

## ⚖️ Illustrative Data Notice

All fleet statistics, session identifiers, crash traces, and patch listings are illustrative engineering models designed to demonstrate domain expertise and technical methodology without disclosing proprietary vendor systems.
