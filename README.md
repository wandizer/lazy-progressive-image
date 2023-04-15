<img src="./public/images/header.png" alt="header image" />

<br />

<div align="center">
    <h1>⚛ LazyProgressiveImage.tsx</h1>
    <h2>+ useImageOnLoadEnhanced() ✨</h2>
</div>

<br />

# Introduction

Ever wondered how to load your images only when visible? This component helps you lazy-load your image (responsive or not), with some smooth aminations.

It uses `IntersectionObserver` API to only load the images only visible on the screen/viewport. It alows to load the image `Lazily`.

More than that, `LazyProgressiveImage` is capable of loading a thumbnail/placeholder image (smaller size image) first, and only show the full size image when it finishes loading completly.

Once both (placeholder image and full size) images are loaded, the placeholder is removed from the DOM to avoid enlarging it.

For **responsiveness**, `LazyProgressiveImage` is also capable of loading several different sources, and let the browser do it's magic with `<picture>` element.

# Dependencies:

This component is essentially based on useHook.ts different hooks, such as:

1. [useImageOnLoad](https://usehooks-ts.com/react-hook/use-image-on-load) → customised into [useImageOnLoadEnhanced](https://github.com/wandizer/lazy-progressive-image/blob/main/src/hooks/useImageOnLoadEnhanced.ts) locally
2. [useIntersectionObserver](https://usehooks-ts.com/react-hook/use-intersection-observer)
3. [useTimeout](https://usehooks-ts.com/react-hook/use-timeout)

- (1) The heard of the component to add smooth transitions when image is ready to be painted.
- (2) Hook responsible for detecting when image is visible on screen to start the loading process (followed by the rendering process)
- (3) Used to remove the placeholder/thumbnail image when no longer necessary. (Timeout delay needed to avoid removing before the end of the CSS transition of opacity of Full size image)
