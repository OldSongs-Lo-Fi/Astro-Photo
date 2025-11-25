## 🚀 Astro Photo – Automatic Detection of Light-Polluted and Satellite-Trailed Astrophotos

**Astro Photo** is a lightweight, fast, and fully customizable Node.js tool that **automatically distinguishes high-quality starry sky images from light-polluted, cloudy, or satellite-trailed ones**.

🔭 Perfect for:
* Preprocessing large astronomical datasets
* Filtering out bad frames before photometry or asteroid detection
* Automating pipelines in amateur and professional astronomy

---

## 🌌 Why This Tool?

On platforms like **[Zooniverse](https://www.zooniverse.org/)** (e.g., *Planet Hunters TESS*, *Asteroid Zoo*, *Backyard Worlds*), thousands of telescope images are processed daily by volunteers and algorithms.
Many are **unusable** due to:
* Cloud cover
* Light pollution
* Fog or haze
* Poor exposure
* **Satellite or aircraft light trails (streaks)**

**This program automatically rejects such frames**, saving time and improving analysis accuracy.

---

## 🛰️ How It Works

Astro Photo uses a two-pronged approach for rejection: **Luminance-based analysis** for overall sky quality and **Hough Transform** for detecting linear satellite trails.

### 1. Light Pollution/Cloud Detection (Luminance Analysis)

This method assesses the overall brightness uniformity, which is disrupted by clouds or light pollution.

1.  Reads raw pixel data (supports JPG, JPEG, PNG and others)
2.  Computes **luminance** for each pixel using ITU-R BT.709
3.  Sorts all pixels by brightness
4.  Determines:
   * `darkTone` → lower percentile (e.g., 5%) = **background sky level**
   * `lightTone` → upper percentile (e.g., 99.9%) = **dynamic range cap**
5.  Calculates **adaptive threshold**:
    $$\text{threshold} = \text{darkTone} + \text{TOLERANCE} \times (\text{lightTone} - \text{darkTone})$$
6.  Counts how many pixels fall into the "dark" zone
7.  If **$\ge 95\%$ pixels are dark → CLEAR SKY**

---

### 2. Satellite Trail Detection (Hough Transform)

This functionality specifically targets images containing **bright, linear streaks**, commonly caused by satellites (like Starlink) or aircraft.

* The program employs the **Hough Transform** method, a classic technique in computer vision, which is highly effective for detecting straight lines in images.
* The transform maps image coordinates (x, y) into a parameter space (rho, theta), where lines become intersecting points.
* A high concentration of votes in the parameter space indicates the presence of a dominant, long line (the satellite trail).
* If a significant linear feature is detected, the image is flagged as **trailed** and is rejected.

---

## 6 Tunable Parameters

| Parameter | Description                                               | Default |
| :--- |:----------------------------------------------------------| :--- |
| `DOWN_PERS` | Lower percentile for background sky (used for `darkTone`) | `5` (5%) |
| `UPPER_PERS` | Upper cutoff (ignores brightest stars for `lightTone`)    | `0.1` (0.1%) |
| `TOLERANCE` | Allowed deviation from background (as % of range)         | `0.08` (8%) |
| `DARK_THRESHOLD` | Min. % of dark pixels to classify as "clear"              | `0.95` (95%) |
| `ANGLE_STEP` | The step size (in degrees) for line construction in the Hough method. For example, a step of `15` will check lines at 0°, 15°, 30°, etc., up to 180° | `1` (1°) |
| `LINE_THRESHOLD` | The minimum vote threshold, expressed as a fraction (percentage) of the image's diagonal length, required to classify a detected line as a satellite trail. | `0.5` (50%) |

> **👽 Calibrate in 5 minutes using your own data!**

```js
// Example: for very dark skies
const DOWN_PERS = 3;
const TOLERANCE = 0.05;