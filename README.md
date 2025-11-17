# Sky Quality Detector – Automatic Detection of Light-Polluted Astrophotos

**Sky Quality Detector** is a lightweight, fast, and fully customizable Node.js tool that **automatically distinguishes high-quality starry sky images from light-polluted or cloudy ones**.

Perfect for:
- Preprocessing large astronomical datasets
- Filtering out bad frames before photometry or asteroid detection
- Automating pipelines in amateur and professional astronomy

---

## Why This Tool?

On platforms like **[Zooniverse](https://www.zooniverse.org/)** (e.g., *Planet Hunters TESS*, *Asteroid Zoo*, *Backyard Worlds*), thousands of telescope images are processed daily by volunteers and algorithms.  
Many are **unusable** due to:
- Cloud cover
- Light pollution
- Fog or haze
- Poor exposure

**This program automatically rejects such frames**, saving time and improving analysis accuracy.

---

## How It Works

1. Reads raw pixel data (supports JPG, PNG, TIFF, FITS via `sharp`)
2. Computes **luminance** for each pixel using ITU-R BT.709
3. Sorts all pixels by brightness
4. Determines:
   - `darkTone` → lower percentile (e.g., 5%) = **background sky level**
   - `lightTone` → upper percentile (e.g., 99.9%) = **dynamic range cap**
5. Calculates **adaptive threshold**:  
   `threshold = darkTone + TOLERANCE × (lightTone - darkTone)`
6. Counts how many pixels fall into the "dark" zone
7. If **≥ 95% pixels are dark → CLEAR SKY**

---

## 4 Tunable Parameters

| Parameter | Description | Default |
|---------|-------------|---------|
| `DOWN_PERS` | Lower percentile for background sky | `5` (5%) |
| `UPPER_PERS` | Upper cutoff (ignores brightest stars) | `0.1` (0.1%) |
| `TOLERANCE` | Allowed deviation from background (as % of range) | `0.08` (8%) |
| `DARK_THRESHOLD` | Min. % of dark pixels to classify as "clear" | `0.95` (95%) |

> **Calibrate in 5 minutes using your own data!**

```js
// Example: for very dark skies
const DOWN_PERS = 3;
const TOLERANCE = 0.05;
