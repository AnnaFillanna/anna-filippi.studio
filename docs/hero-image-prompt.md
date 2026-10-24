# Hero background

Asset: `public/images/hero-reference.png`
Generated with the built-in ImageGen tool on 2026-10-23, using the supplied screenshot as an edit target.

## Final prompt

Edit the attached website screenshot into a clean photographic website background. Remove ALL text, monogram, icons, lines and buttons, replacing them seamlessly with the warm ivory cream background. Preserve the exact photographed woman profile on right, her windswept blonde hair, red translucent fabric and composition. Match reference closely: woman's face is in rightmost 40%, left 58% stays clean pale cream for HTML text from y=15% through y=74%. Red flowing translucent chiffon sweeps across bottom 25% and right edge. Photorealistic luxury fashion editorial. Landscape 16:9. No text, no logo, no UI. This asset will sit behind actual HTML heading and buttons.

## Atelier portrait revision

Asset: `public/images/hero-atelier.png`. Built-in ImageGen, using the supplied portrait as identity source and the new screenshot as layout reference.

Prompt: Create a clean website hero background by compositing image 1 (the actual portrait, identity source) into the composition of image 2 (layout reference). Preserve image 1 woman's exact identity, facial features, expression, straight blonde hair, black blazer, white shirt, silver laptop and hands. Landscape 16:9. Woman occupies right half, top of hair near y=11%, body extends to bottom, face near x=67%. Left 48% clean warm ivory negative space for real HTML content. Background warm ivory architectural wall, soft diagonal sunlight shadows and faint palm shadows on far right, a narrow deep burgundy wall strip at extreme right. Match reference refined photography. Remove ALL lettering, logos of website, buttons, icons and decorative curved lines from reference; they will be HTML/SVG. No red fabric. Do not beautify or change woman's face. Photorealistic. Output high resolution 16:9.

## Original portrait correction

The active hero now uses `public/images/anna-laptop-original.jpg`, a byte-identical copy of the supplied Foto 2.jpg (853 × 1280). No image generation, retouching, or recompression was applied. The original photographic background is retained, with CSS edge blending and a separate CSS page background. The generated atelier composite is no longer displayed.


## Separate sunlit background (2026-10-24)

The original portrait remains byte-identical in `public/images/anna-laptop-original.jpg`. A separate luminance mask (`anna-laptop-mask.png`), extracted using macOS Vision foreground segmentation, hides its gray backdrop through CSS. No generative editing or retouching is applied to the person.

Background asset: `public/images/hero-sunlight.png`. Generated separately with this prompt:

> Photorealistic empty background plate for an elegant personal portfolio website, 16:9 landscape. Warm neutral ivory plaster wall, soft natural sunlight falling diagonally from upper right across the wall, beautiful subtle blurred palm frond shadows ONLY in far right third, faint architectural window light, understated luxury editorial photography. Entire left half and center are clean pale ivory negative space for text and a portrait composited later. Very subtle warm stone floor sliver at bottom, no strong horizon. No people, no faces, no furniture, no office, no desk, no laptop, no objects, no arches, no frames, no text, no logos, no red fabric. Cream and pale taupe harmonious palette, restrained soft sunlight, gentle shadow contrast. Background only.

A restrained cherry-burgundy strip is rendered separately in CSS at the right edge. The background covers the entire hero on mobile to avoid a visible color seam.
