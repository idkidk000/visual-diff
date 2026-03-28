## Visual Diff

Run two web apps side-by-side, i.e. for testing a feature branch against main.

Fully keyboard navigable with `ctrl+k` handling to focus the nav controls.

The [`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options) header on the target app must be disabled or set to permit whatever URL this app is running on.

[It's hosted on Github pages](https://idkidk000.github.io/visual-diff/) but your browser will block iframing plain HTTP content, so you will need to run it locally for that

### Install Deps

```bash
nvm use
pnpm i
```

### Usage

- `pnpm dev`
- open up `http://localhost:4000/`
