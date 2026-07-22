# Avento full-bleed hero and multi-brand filters design

## Goal

Replace the catalogue BMW hero slide with the supplied Audi and Range Rover visuals, restore a full-bleed sharp-edged hero, and make the vehicle picker useful with simultaneous brand selection.

## Hero

Three local slides use the supplied BMW, Audi, and Range Rover images; the prior `/cars/bmw-x5-front.png` slide is removed. The hero spans the full viewport width below the header, has square outer corners, and returns to its previous taller presentation. The circular controls remain. A centred `Дивитися більше` link sits above the bottom edge, highlights on hover, and routes to `/cars`.

## Vehicle picker

The top area is condensed so at least the first vehicle cards are visible on a standard desktop viewport. Brand filter state becomes `brands: string[]`. Selecting multiple brand chips uses OR matching: cars are shown when their brand belongs to any selected chip. Other filters continue to combine with the brand match.

## Testing

Assert local Audi/Range Rover hero assets and no catalogue BMW hero slide, the full-bleed hero and CTA markup, and multi-brand OR filtering. Preserve existing checks.
