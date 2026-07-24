# Buyout and Navigation Refinement Design

## Approved direction

Use the supplied blue line-art images as the visual anchors above the four existing buyout steps. Keep the page compact and proportionate: the heading/form, document table, and four-step explanation share the same content width and spacing rhythm.

## Decisions

- The document table has no blue top rule; required-document plus marks use the site blue.
- The two-level navigation is sticky as one unit while scrolling.
- Mileage inputs show the `Мін.` or `Макс.` placeholder within the input itself and hide it when a value is entered; `км` stays aligned in the same visual row.
- The detailed rating tooltip is level, not rotated.
- The hero retains its full-height visual while its dots and controls stay inside the viewport.
- Genesis uses a stable local SVG mark; if it is not available, the brand is removed rather than rendered as a broken external asset.

## Verification

Rendered-page tests cover the four process images, sticky navigation hooks, the unrotated detail tooltip, and the local Genesis asset. Build, tests, and lint must pass before deployment.
