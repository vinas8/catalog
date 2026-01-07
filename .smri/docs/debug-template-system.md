# 🎨 Debug Template System

**Rule:** ALL `/debug/**` pages must use base template

## Base Template Pattern

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{PAGE_TITLE}</title>
  <link rel="stylesheet" href="/debug/templates/base.css">
</head>
<body>
  <div class="container">
    <!-- PAGE CONTENT -->
  </div>
  <script src="/debug/templates/base.js"></script>
</body>
</html>
```

## Coverage

✅ Must use template:
- `/debug/index.html`
- `/debug/releases/index.html`
- `/debug/releases/*/demo.html`
- All new debug pages

## Shared Styles (base.css)

```css
:root {
  --bg-primary: #0a0e14;
  --bg-secondary: #161b22;
  --accent: #667eea;
  --text: #c9d1d9;
  --border: #30363d;
}

.container { max-width: 1400px; margin: 0 auto; }
.card { background: var(--bg-secondary); border-radius: 12px; }
/* Mobile responsive breakpoints */
```

## Update Rule

When creating `/debug/**` pages:
1. Copy template from `debug/templates/base.html`
2. Replace `{PAGE_TITLE}` and content
3. Or justify deviation in commit
