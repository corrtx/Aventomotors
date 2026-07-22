# Avento Motors: practical home, forms, and gallery update

## Purpose

Make the homepage more useful for choosing a car while retaining its sparse dark visual language. Remove decorative bubbles and make the existing flows clearer.

## Homepage

- Keep the first screen limited to the Avento Motors label, the `Обрати авто` heading, and a compact search form for brand and maximum price.
- Do not add slogans, badges, result counts, or other pill-shaped status elements.
- Keep the search as the primary action; vehicle cards follow below the first screen.
- Center `Переглянути всі марки` below the moving brand rail. It is plain text, not a button or pill.

## Forms

- Credit requests offer 6, 12, 24, 36, 48, and 60 month terms.
- Exchange requests include a required free-text `Ваш автомобіль` field for the user to describe their car.

## Brand rail and footer

- Brand cards stay white on hover. Their border and background do not change.
- Hovering the rail reduces its animation speed instead of stopping it.
- Footer content is centered. It keeps `Avento Motors`, the service line, and `© 2026` as a vertical group.

## Header mark

- The supplied logo is displayed as the A mark only, cropped so the lower Avento Motors wordmark is not visible.
- The A mark is larger than before.
- A text wordmark sits to its right in the letter-spaced style of the original wordmark.

## Vehicle gallery

- With two images, show two equal large images side by side.
- With three or four images, show image one as the large left tile. Show image two in the smaller upper-right tile. Images three and four occupy equal small tiles beneath it; if there are only three images, the remaining lower-right tile is omitted.
- With five or more images, the fourth tile receives a subtle dark overlay with `+N`, where N is the count beyond the fourth image. Selecting that tile opens the full photo list.
- The full photo list opens in an accessible modal with next/previous controls and an escape/close action.

## Verification

- Add regression tests for the credit terms, exchange field, removed vehicle count, centered all-brands link, and gallery layout states.
- Build and run the test suite and linter.
- Check desktop and mobile layouts in a browser, including navigation from a card to the gallery page.
