# CSS Guide (PØTEPASS)

This document explains how to keep `style.css` reusable and easy to maintain as the project grows.  
Goal: **Global styles in `style.css`**, page-specific layout in `src/Pages/<page>/<page>.css`.

---

## 1. What belongs where?

### `style.css` (global / reusable)

Put things here if they are used in **more than one page**:
- Design tokens (CSS variables in `:root`)
- Base reset (box-sizing, body defaults, images, links)
- Typography defaults (h1–h5, p)
- Reusable components:
  - `.btn` + variants (`.btn-success`, etc.)
  - Form blueprint (`.form`, `.form-field`, `.form-control`, etc.)
  - Header and footer (because it's used them everywhere)

### Page CSS files (e.g. `status.css`, `registration.css`)

Put things here if they are **unique to one page**:
- Layout for a specific page (grid, section spacing, widths)
- Page-only components (e.g. `.status-box`, `.booking-row`, `.reg-card`)

**Rule of thumb:**  
If you copy a class to a second page, it probably should be moved to `style.css`.

---

## 2. Naming conventions

### Use “component + part” naming

Examples:
- `.site-header`, `.site-header-nav`
- `.site-footer`, `.site-footer-contact`
- `.form-field`, `.form-control`
- `.status-tab`, `.status-box`

Avoid very generic names like `.box`, `.left`, `.green`, `.wrapper` because they will collide later.

### Modifiers

Use a second class to create variants without duplicating styles:
- Buttons: `.btn btn-success`
- State: `.is-active`, `.is-open`, `.is-hidden` (small “state” classes)

Example:
```html
<button class="status-pill is-active">ALLE</button>
```
Keep modifiers small: they should only change 1–3 properties.

---

## 3. Reuse the design tokens (CSS variables)

We already have:

- **Colors:** `--primary`, `--primary-shade-2`, etc.  
- **Type scale:** `--h1`, `--body`, etc.

### Guidelines

- Prefer `var(--primary)` instead of writing hex colors everywhere.
- If you keep writing the same hex value in multiple places, add a variable for it.
- Page-specific “special colors” are okay (for example: a single section background), but if that color appears repeatedly, move it to `:root`.

### Example

```css
background: var(--primary-card);
border-color: var(--primary-shade-2);
```
---

## 4. Typography rules (keep consistent)

### Global typography stays global

Our global headings and `p` styles should stay in `style.css`.

### Page CSS should avoid resetting base typography

Instead, page CSS should only adjust spacing/layout:

- `margin`
- `max-width`
- alignment (`text-align`)
- sometimes `text-transform`

Avoid setting random font sizes in page CSS unless it is truly unique.

### Good (page-specific spacing)

```css
.status-title { margin-bottom: 1rem; }
```

Avoid (breaks global scale):

```css
.status-title { font-size: 48px; }
```

---

## 5. Buttons (reusable pattern)

### Use base + variant

Always combine:

- `.btn` + one variant class (if needed)

#### Examples

```html
<a class="btn btn-success" href="#">NY BOOKING</a>
<button class="btn btn-danger">KANSERLER</button>
```

### Page-specific tweaks should be a new class

If one page needs smaller buttons, don’t edit `.btn`. Add a page class:

```css
.status-btn {
  font-size: 0.75rem;
  padding: 0.35rem 0.75rem;
  box-shadow: none;
}
```

---

## 6. Forms (blueprint + page layout)

### Always reuse the blueprint

Use our global form classes:

- `.form`
- `.form-field`
- `.form-label`
- `.form-control`

### Example

```html
<form class="form">
  <div class="form-field">
    <label class="form-label" for="email">E-post</label>
    <input class="form-control" id="email" type="email" />
  </div>
</form>
```

### Page-specific form layout is allowed

If one form needs a different grid or spacing, wrap it:

```html
<form class="form reg-form">...</form>
```

Then in `registration.css`:

```CSS
.reg-form .form-field { grid-template-columns: 8rem 1fr; }
```

That way we still keep the shared blueprint.

---

## 7. Layout helpers (optional but useful)

We already use:

- `.page` + `.main` for sticky footer layout

Recommended addition (global helper) if we find ourselves repeating them:

- `.container` (max-width wrapper)

Only add helpers if we actually reuse them more than once.

---

## 8. Practical “reuse checklist”

Before adding CSS to a page file, ask:

1) **Will this be used on more than one page?** 
   - Yes → put it in `style.css`  
   - No → keep it in `<page>.css`

2) **Is it a “component” (button/form) or “layout” (grid/spacing)?**  
   - Component → `style.css`  
   - Layout → `<page>.css`

3) **Am I repeating colors / sizes?**  
   - Repeated → add a `:root` variable

4) **Am I overriding `.btn` or `.form-control` directly?**  
   - Prefer a page class like `.status-btn`, `.reg-form` instead

---

## 9. Examples from this project

### ✅ Good reuse
- `.btn` + `.btn-success`
- `.form` + `.form-control`

### ✅ Good page-specific
- `.status-box`, `.status-row` (status page only)
- `.reg-card`, `.reg-panel` (registration only)

### ✅ Good state naming
- `.is-active` for tabs
- `.is-open` for overlays (if you use them later)

---

## Summary

- `style.css` = design system + reusable components  
- page CSS = layout + page-only components  
- reuse `.btn` and `.form` patterns  
- create page-specific modifier classes instead of rewriting base classes  
- use CSS variables for consistency

---

## References

- [MDN — Using CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [MDN — Organizing your CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Organizing)
- [BEM — Quick start (bem.info)](https://en.bem.info/methodology/quick-start/)
- [BEM — Introduction (getbem.com)](https://getbem.com/introduction/)
- [Google — HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)
- [Philip Walton — CSS Architecture](https://philipwalton.com/articles/css-architecture/)

---

## Team workflow

- **Design tokens & global components** (`:root`, `.btn`, `.form`, header/footer) live in `style.css`.
  - If you need a new global utility/component, mention it in the group chat before adding it.
- **Page CSS** stays in `src/Pages/<page>/<page>.css` and uses a page prefix:
  - `status-*`, `reg-*`, `home-*`, etc.
- If you’re unsure whether something is reusable, keep it page-specific first. If we reuse it on a second page, we move it to `style.css`.