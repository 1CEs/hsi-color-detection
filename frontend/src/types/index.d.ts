type HSIColor = {
    h: number,
    s: number,
    i: number
}

type HSLColor = {
    h: number,
    s: number,
    l: number
}

type RGBColor = {
    r: number,
    g: number,
    b: number
}

type BoundCardAttrs = {
    name: keyof HSIColor,
    placeholder: string,
    range: { step?: number | undefined, min: string, max: string, name: string },
    boxcss: string
}

type ProcessResponse = {
    images: {
        mask: string
        gray_image: string
        overlay_image: string
    }
    message: string
}