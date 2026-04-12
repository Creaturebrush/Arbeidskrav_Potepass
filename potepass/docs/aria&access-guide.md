# ARIA & Accessibility Guide (PØTEPASS)

This guide is a shared reference for how we label and structure UI so the site is consistent and accessible.

**Rule #1:** Prefer *native HTML* (button, link, form labels, `<details>`). Use ARIA only when needed.

---

## 1. General rules

### Buttons vs links
- Use **`<a>`** for navigation (changes page/URL).
- Use **`<button>`** for actions (open modal, expand card, submit, filter, etc.).

**Good**

```html
<a href="/src/Pages/sitters/sitters.html">Finn hundepassere</a>
<button type="button">Åpne filter</button>
```

### Decorative icons/images

If an icon/image is decorative (not essential information):

```html
<img src="/images/PawPrint_line.png" alt="" aria-hidden="true" />
```

If an icon is inside an interactive element, label the button/link, not the image:

```html
<button aria-label="Søk">
  <img src="/images/search.png" alt="" aria-hidden="true" />
</button>
```

### Don’t overuse ARIA

If HTML already provides semantics, don’t add ARIA “just in case”.
Example: `<label for>` + `<input id>` is better than aria-label on inputs.

---

## 2. Page titles and document titles

Each page should have a unique `<title>`:

`PØTEPASS | Hjemmeside`

`PØTEPASS | Hundepassere`

`PØTEPASS | Min Profil`

`PØTEPASS | Book Hundepasser`

`PØTEPASS | Mine Avtaler`

Each page should have a single `<h1>` describing the page.

---

## 3. Forms (Registration, Login modal, Booking forms)

### Labels are required

Every input must have a `<label>` connected via `for` and `id`:

```html
<label for="email">E-post</label>
<input id="email" type="email" />
```

### Required fields

Use native required and (optionally) visible indicator:

```html
<label for="pw">Passord <span aria-hidden="true">*</span></label>
<input id="pw" type="password" required />
```

### Help/error text

Use `aria-describedby` to connect helper/error messages:

```html
<label for="phone">Telefon</label>
<input id="phone" aria-describedby="phoneHelp" />
<p id="phoneHelp">Skriv inn norsk telefonnummer.</p>
```

If you show an error message dynamically, put it in an element with an id and connect it the same way.

---

## 4. Tabs (Status page, Sitters page)

We use tabs for switching content (e.g. “Dine bookinger” vs “Forespørsler”).

### Recommended markup

- Container: `role="tablist"`

- Each tab: `role="tab"` + `aria-selected`

- Panels: `role="tabpanel"` + `aria-labelledby`

Example:

```html
<div role="tablist" aria-label="Velg visning">
  <a href="#" role="tab" aria-selected="true" id="tab-bookings" data-tab="bookings">Dine bookinger</a>
  <a href="#" role="tab" aria-selected="false" id="tab-requests" data-tab="requests">Forespørsler</a>
</div>

<section role="tabpanel" aria-labelledby="tab-bookings" data-panel="bookings">...</section>
<section role="tabpanel" aria-labelledby="tab-requests" data-panel="requests" hidden>...</section>
```

### When switching tabs (JS)

Update `aria-selected` on tabs.

Hide inactive panel (`hidden` attribute or `display:none`).

Optionally move focus to the active tab.

---

## 5. Expand/Collapse rows (Sitters page)

Use a `<button>` to toggle, and connect it to the expandable content.

Example:

```html
<button type="button" aria-expanded="false" aria-controls="sitter-omtaler">
  3 omtaler
</button>

<div id="sitter-omtaler" hidden>
  Mer informasjon her...
</div>
```

### When toggled:

`aria-expanded="true"` and remove `hidden`

`aria-expanded="false"` and add `hidden`

---

## 6. Dropdowns

Prefer `<details>` + `<summary>` for simple dropdowns (minimal ARIA needed).

Example:

```html
<details>
  <summary>Nyeste først</summary>
  <button type="button">Eldste først</button>
</details>
```

### When using custom dropdown:

- Use `aria-expanded` on the trigger

- Use `role="listbox"` / `role="option"` only if necessary (custom select)

---

## 7. Modals / overlays

### Required modal attributes

- `role="dialog"`

- `aria-modal="true"`

- `aria-labelledby` pointing to the modal title

- Close on ESC and backdrop click (good UX)

Example:

```html
<div class="modal is-open" aria-hidden="false">
  <div class="modal-backdrop" data-close="true"></div>

  <section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
    <button class="modal-close" type="button" aria-label="Lukk" data-close="true">✕</button>
    <h4 id="loginTitle">LOGG INN</h4>
  </section>
</div>
```

### Focus (simple rule)

When a modal opens, focus should go to:

- the first input

- or the close button

When modal closes, focus should return to the element that opened it.

---

## 8. Toasts/ status messages (non-blocking)

Some small messages should not be modals (e.g. “Endringer ble lagret!”, “Melding sendt!”, “Booking kansellert!”).
These should not trap focus.

- Success/info: `role="status"` (announced politely)

- Error: `role="alert"` (announced immediately)

Examples:

```html
<div class="toast toast-success" role="status">
  Endringene ble lagret!
</div>
```

```html
<div class="toast toast-error" role="alert">
  Noe gikk galt. Prøv igjen.
</div>
```

---

## 9. Selection dialogs

In places where the user have multiple options to choose from, use checkboxes.

Example:

```html
<fieldset>
  <legend>Hvilken hund ønsker du å fjerne?</legend>

  <label>
    <input type="checkbox" name="dog" value="mio" />
    Mio
  </label>

  <label>
    <input type="checkbox" name="dog" value="charlie" />
    Charlie
  </label>
</fieldset>
```

You can keep the selection accessible and still style the `<label>` as wanted - card grid in the profile page, for example. This way the checkbox inputs still exist and screen readers understand the selection, and `<label>` makes the whole card clickable.

---

## 10. Loading states (spinners / “Sjekker booking…”)

Screens like “Sjekker at booking ikke allerede er bekreftet”.

### Rules

- Provide visible text describing what is happening.

- Mark the area that is updating with `aria-busy="true"`.

Example:

```html
<section aria-busy="true">
  <p>Sjekker at booking ikke allerede er bekreftet…</p>
</section>
```

For a spinner icon:

```html
<div class="spinner" aria-hidden="true"></div>
```

---

## 11. Indicators (dots, stars)

If decorative, hide it:

```html
<span class="dot dot-green" aria-hidden="true"></span>
```

If meaningful, provide text:

```html
<div class="stars" aria-label="Vurdering 4 av 5">★★★★☆</div>
```

---

## 12. Images: consistent alt text (Norwegian)

### Decorative UI images

Use empty alt if decorative:

```html
<img src="/images/Pawprint_line.png" alt="" />
```

### Informative images

Use short, natural Norwegian:

```html
 <img src="/images/hero.jpg" alt="Hund som ligger med leker"/>
```

---

## Summary

- One `<h1>` per page + page `<title>` is correct  
- Inputs have `<label for>` + `id`  
- Buttons for actions, links for navigation  
- Decorative icons/images use `alt=""` and/or `aria-hidden="true"`  
- Tabs update `aria-selected` and hide inactive panels  
- Expand toggles use `aria-expanded` + `aria-controls`  
- Modals have `role="dialog" aria-modal="true" aria-labelledby`  
- Toasts use `role="status"` or `role="alert"`  
- Loading states use text + `aria-busy="true"`

## References

- [MDN — ARIA (Accessibility)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [MDN — WAI-ARIA basics (Learn web development)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/WAI-ARIA_basics)
- [MDN — aria-describedby (attribute reference)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby)
- [MDN — aria-labelledby (attribute reference)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby)
- [W3C WAI — ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- [W3C WAI — WAI-ARIA Overview](https://www.w3.org/WAI/standards-guidelines/aria/)