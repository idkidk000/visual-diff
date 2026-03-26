## Visual Diff

Run two web apps side-by-side, i.e. for testing a feature branch against main.

The `X-Frame-Option` header on the target app must be disabled or set to permit whatever URL this app is running on.

### Install Deps

```bash
nvm use
pnpm i
```

### Usage

- `pnpm dev`
- open up `http://localhost:4000/`

### TODO

- Make breakpoints configurable
- Make iframe sandbox opts configurable
- Capture screenshots
- Add an overlay/diff view
- Rip out Tanstack Start and use plain Vite
