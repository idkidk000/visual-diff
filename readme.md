## Visual Diff

Run two web apps side-by-side, i.e. for testing a feature branch against main.

Fully keyboard navigable with `ctrl+k` handling to focus the nav controls.

The `X-Frame-Options` header on the target app must be disabled or set to permit whatever URL this app is running on.

### Install Deps

```bash
nvm use
pnpm i
```

### Usage

- `pnpm dev`
- open up `http://localhost:4000/`

### Todo

- Rip out Tanstack Start and build for Github Pages
