type RGBColor = {
    r: number
    g: number
    b: number
}

export function cvtHSI_RGB(h: number, s: number, i: number): RGBColor  {
    const hRad = (h * Math.PI) / 180 
    const iNormalized = i / 255 

    let r = 0, g = 0, b = 0

    if (hRad < (2 * Math.PI) / 3) {
        r = iNormalized * (1 + s * Math.cos(hRad) / Math.cos(Math.PI / 3 - hRad))
        b = iNormalized * (1 - s)
        g = 3 * iNormalized - (r + b)
    } else if (hRad < (4 * Math.PI) / 3) {
        const hPrime = hRad - (2 * Math.PI) / 3
        g = iNormalized * (1 + s * Math.cos(hPrime) / Math.cos(Math.PI / 3 - hPrime))
        r = iNormalized * (1 - s)
        b = 3 * iNormalized - (r + g)
    } else {
        const hPrime = hRad - (4 * Math.PI) / 3
        b = iNormalized * (1 + s * Math.cos(hPrime) / Math.cos(Math.PI / 3 - hPrime))
        g = iNormalized * (1 - s)
        r = 3 * iNormalized - (g + b)
    }

    r = Math.min(255, Math.max(0, r * 255))
    g = Math.min(255, Math.max(0, g * 255))
    b = Math.min(255, Math.max(0, b * 255))

    return {r: Math.round(r), g: Math.round(g), b: Math.round(b)}
}