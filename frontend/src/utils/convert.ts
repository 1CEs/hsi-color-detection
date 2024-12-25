export const cvtHSI_RGB = (hsi: HSIColor): RGBColor => {
    let h = hsi.h * Math.PI / 180
    const s = hsi.s
    const i = hsi.i / 255
    const PI = Math.PI

    if (h < ((2 * PI) / 3)) {
        const { x, y, z } = calXYZ({ h, s, i })
        return {
            r: y,
            g: z,
            b: x
        }
    } else if (h < ((4 * PI) / 3)) {
        h = h - ((2 * PI) / 3)
        const { x, y, z } = calXYZ({ h, s, i })
        return {
            r: x,
            g: y,
            b: z
        }
    } else {
        h = h - ((4 * PI) / 3)
        const { x, y, z } = calXYZ({ h, s, i })
        return {
            r: z,
            g: x,
            b: y
        }
    }
}

const calXYZ = ({ h, s, i }: HSIColor) => {
    const newH = parseFloat(h.toFixed(3))
    let x = i * (1 - s)
    let y = i * (1 + (s * Math.cos(newH)) / Math.cos(Math.PI / 3 - newH))
    let z = 3 * i - (x + y)
    return { x: Number((x * 255).toFixed(0)), y: Number((y * 255).toFixed(0)), z: Number((z * 255).toFixed(0)) }
}