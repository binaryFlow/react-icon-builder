# React Icon Builder

A tiny, zero-dependency tool that turns raw **SVG markup** into a typed
**React/TypeScript icon component** and (optionally) writes it straight into your
project's icon folder.

Paste an SVG, give it a name, and get back a ready-to-use `.tsx` component with a
`size` prop, spread props, and clean camelCased attributes.

## What it does

- **SVG → JSX** — converts SVG attributes to React-friendly camelCase
  (`stroke-width` → `strokeWidth`, `fill-rule` → `fillRule`, etc.).
- **Color analysis** — inspects every `fill` / `stroke` value and tells you
  whether the icon is safe to emit as-is, or can be made themeable by swapping a
  dominant color for `currentColor`.
- **Typed component output** — generates a component like:

  ```tsx
  import React from 'react';

  interface VolumeMaxProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
  }

  export const VolumeMax = ({ size = 16, ...props }: VolumeMaxProps) => {
    return (
      <svg width={size} height={size} {...props} viewBox="0 0 24 24">
        <path d="..." />
      </svg>
    );
  };
  ```

- **Auto component name** — an icon name like `volume-max` becomes the component
  `VolumeMax`.
- **Three ways to save** — copy to clipboard, save via a local helper server, or
  save directly to a folder using the browser's File System Access API.

## Files

| File | Purpose |
| --- | --- |
| `react-icon-builder.html` | The whole tool — a single self-contained HTML page (UI + logic, no build, no dependencies). |
| `server-icon-builder.js` | Optional Node helper that writes generated icons into your project and keeps `index.ts` exports up to date. |

## Quick start

Just open the page in a browser:

```bash
open react-icon-builder.html      # macOS
```

Then:

1. Enter an **icon name** (e.g. `volume-max`) — the component name preview
   updates as you type.
2. Paste your **SVG markup** into the textarea.
3. (Optional) set a default **size**.
4. Review the **color verdict** and choose whether to use `currentColor`.
5. **Copy** the generated code, or **Save to project**.

## Saving to your project (optional)

You have two options for writing files directly.

### Option A — local helper server

`server-icon-builder.js` runs a small HTTP server on `127.0.0.1:7891`. When you
click **Save to project**, the page POSTs the generated component to it, and the
server:

- writes `<icon-name>.tsx` into your icons directory, and
- appends `export { ComponentName } from './<icon-name>';` to `index.ts`
  (only if it isn't already exported).

Start it with:

```bash
node server-icon-builder.js
```

The target folder is set at the top of the file:

```js
const ICONS_DIR = path.join(os.homedir(), "projects/frontend-v6/src/components/icons");
```

Edit `ICONS_DIR` to point at your own project's icon folder. You can verify it's
running and check the resolved path at <http://127.0.0.1:7891/ping>.

### Option B — File System Access API

If you don't run the server, the page falls back to the browser's File System
Access API: pick your icons directory once and it writes the `.tsx` file and
updates `index.ts` in place. This works in Chromium-based browsers (Chrome,
Edge) over `localhost`/`file://`.

## Requirements

- A modern browser for the tool itself.
- **Node.js** (any recent version) only if you use the local helper server.
- No npm install, no build step, no external dependencies.
