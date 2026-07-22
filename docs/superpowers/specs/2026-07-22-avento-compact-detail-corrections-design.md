# Avento compact detail corrections design

## Goal

Correct the Avento visual hierarchy so the home banner is wide but compact, vehicle actions are ordinary buttons, and the primary vehicle-detail view fits a standard desktop screen.

## Home and identity

The hero visual spans the available page width inside the standard outer gutters, with a fixed desktop height of roughly 520–580 px rather than viewport height. Its arrow controls are circular icon-only controls. Every manual arrow action resets the next automatic transition to four seconds.

The logo returns to the earlier two-part composition: a clipped image source is used only to show the complete A symbol, with its bounds chosen so no part of that symbol is cut; the wordmark is recreated beside it. The `A` in `AVENTO` consists of two diagonal strokes without a middle crossbar; `MOTORS` is lighter and more widely tracked.

Navigation to `#about` uses smooth scrolling through CSS and same-document link handling.

## Vehicle-card photos

The visible thin blue/grey indicators remain along the bottom edge. Their interactive hit zones become equal invisible vertical columns covering the full photo height and segment width: moving across any column previews the matching photo and activates its indicator. Photo images never scale.

## Vehicle detail

On desktop, the top detail block is a two-column layout with a constrained height: one large image on the left, using circular icon-only previous/next controls; price plus three ordinary buttons on the right. Buttons contain no vehicle image or title. Clicking a button opens the existing form, where the vehicle photo and title appear as the form context. Specifications sit below this top block as a separate compact panel.

The photo viewer closes with Escape, its close icon, or a click on the dimmed area outside its photo.

## Testing

Add rendered-source assertions for the compact hero, icon-only navigation controls, vertical photo-zone structure, resettable carousel function, plain detail buttons, two-column detail top area, and the existing viewer backdrop close behaviour. Preserve current catalogue, build, and lint checks.
