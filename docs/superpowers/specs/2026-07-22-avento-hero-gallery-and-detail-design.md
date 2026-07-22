# Avento hero, gallery, and vehicle detail design

## Goal

Replace the sparse home opening with the approved Ukrainian Avento visual, make vehicle image browsing immediate, and turn each vehicle action into a recognisable car-specific request panel.

## Global constraints

- All new UI copy is Ukrainian; no slogans outside the approved image itself.
- Preserve the Apple-like restrained white interface after the opening visual.
- Use the user-supplied Ukrainian BMW image locally; do not generate or source additional imagery.
- Keep price wording as `Ціна від` and do not add availability labels or decorative count bubbles.

## Home screen

The top content becomes a full-width, dark promotional carousel using the approved supplied image. It has unobtrusive left and right arrow buttons, advances every four seconds, and retains manual navigation. It replaces the current `Обрати авто` quick-search block. The existing vehicle list, about section, brand rail, centred all-brands link, and footer remain below it.

The brand rail remains continuously animated. Hovering or focusing it only changes animation duration to a slower rate; it must not reset or jump to a new position. Brand tiles remain white with their grey borders unchanged while hovered.

`Про нас` uses an in-page hash target and smooth CSS scrolling. Its copy expands to explain 24 years in the market, inventory selection, technical and document checks, financing, trade-in, reservation, and support.

## Identity

The complete supplied mark must be visible without clipping. The wordmark is rebuilt beside it as custom lettering: `AVENTO` has an A made from two diagonal strokes without a crossbar, and `MOTORS` is lighter and spaced, matching the supplied mark's visual language. It is not an image crop.

## Vehicle cards

Card photos never scale on hover. Each card has a bottom photo navigator with one thin segment per available photo. A segment is a transparent hover/click target: hovering or focusing it replaces the displayed cover image with its matching photo and marks only that segment blue. Leaving keeps the last selected image. The photo itself and vehicle name still link to the detail page.

The reservation action includes the explanatory line `Безкоштовний резерв до 24 годин` directly below its button.

## Vehicle detail page

The detail page becomes a sequence of distinct, low-radius white panels: gallery, specifications/price, and requests. The gallery retains its current 2-image and 3+-image layouts, but photos do not scale on hover. The full viewer remains available on click.

The requests section has three independent panels titled `У кредит`, `Обмін`, and `Резерв`. Under each panel title, a compact vehicle identity row shows the current car’s thumbnail at upper left and its brand/model to the right. The credit panel opens the existing credit form; the exchange panel opens the existing vehicle-details form; the reservation panel opens the reservation form and repeats its free-24-hour explanation.

## Testing

Add deterministic helpers for carousel movement and selecting an active image index so behaviour can be unit-tested. Add rendered-source assertions for the new carousel, photo navigation, reservation text, action-panel vehicle identities, smooth-scroll handling and un-clipped logo structure. Preserve existing catalogue and gallery layout tests.
