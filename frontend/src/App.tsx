import { useState, ChangeEvent, useEffect, useRef } from "react"
import BoundCard from "./components/bound-card"
import { cvtHSI_RGB } from "./utils/convert"
import convert from "color-convert"
import { FluentArrowDownload20Filled, IconoirArrowRight, MynauiImageSolid, NotoCrossMark, PepiconsPopLineX } from "./components/icon"
import Button from "./components/button"
import Input from "./components/input"
import Card from "./components/card/card"
import CardBody from "./components/card/card-body"
import CardHeader from "./components/card/card-header"
import Logo from './assets/logo.png'

function App() {
  const [inputImage, setInputImage] = useState<string | null>(null)
  const [overlayColor, setOverlayColor] = useState<string>("#ffffff")
  const [outputImage, setOutputImage] = useState<ProcessResponse["images"] | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputElement = useRef<HTMLInputElement>(null)

  const [upperHSI, setUpperHSI] = useState<HSIColor>({
    h: Math.floor(Math.random() * 360),
    s: parseFloat(Math.random().toFixed(2)),
    i: Math.floor(Math.random() * 255),
  })

  const [lowerHSI, setLowerHSI] = useState<HSIColor>({
    h: Math.floor(Math.random() * 360),
    s: parseFloat(Math.random().toFixed(2)),
    i: Math.floor(Math.random() * 255),
  })

  const [upperRGB, setUpperRGB] = useState<{ r: number, g: number, b: number } | null>(null)
  const [upperHSL, setUpperHSL] = useState<{ h: number, s: number, l: number }>({
    h: upperHSI.h,
    s: upperHSI.s,
    l: upperHSI.i * ((1 + upperHSI.s) / 2),
  })

  const [lowerRGB, setLowerRGB] = useState<{ r: number, g: number, b: number } | null>(null)
  const [lowerHSL, setLowerHSL] = useState<{ h: number, s: number, l: number }>({
    h: lowerHSI.h,
    s: lowerHSI.s,
    l: lowerHSI.i * ((1 + lowerHSI.s) / 2),
  })

  const onHSIValueChange = (
    e: ChangeEvent<HTMLInputElement>,
    name: keyof HSIColor,
    bound: "Upper" | "Lower"
  ) => {
    const setUpdatedHSI = bound === "Upper" ? setUpperHSI : setLowerHSI

    setUpdatedHSI((prev) => ({
      ...prev,
      [name]:
        e.target.value === ""
          ? 0
          : name === "s"
            ? parseFloat(e.target.value)
            : parseInt(e.target.value, 10),
    }))
  }

  useEffect(() => {
    const rgb = cvtHSI_RGB(upperHSI.h, upperHSI.s, upperHSI.i)
    setUpperRGB(rgb)
    if (rgb) {
      const hsl = convert.rgb.hsl(rgb.r, rgb.g, rgb.b)
      setUpperHSL({ h: hsl[0], s: hsl[1], l: hsl[2] })
    }
  }, [upperHSI])

  useEffect(() => {
    const rgb = cvtHSI_RGB(lowerHSI.h, lowerHSI.s, lowerHSI.i)
    setLowerRGB(rgb)
    if (rgb) {
      const hsl = convert.rgb.hsl(rgb.r, rgb.g, rgb.b)
      setLowerHSL({ h: hsl[0], s: hsl[1], l: hsl[2] })
    }
  }, [lowerHSI])

  const onAddImageClick = () => {
    const el = document.getElementById("file")
    if (el) {
      fileInputElement.current!.value = ""
      el.click()
    }
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = () => {
        setInputImage(reader.result as string)
        setImageName(file.name)
      }
    }
  }

  const clearInputImage = () => {
    setImageName(null)
    setInputImage(null)
    setOutputImage(null)
  }

  const onDetectionProcess = async () => {
    try {
      setIsLoading(true)
      setOutputImage(null)
      setError(null)

      const oc = convert.hex.rgb(overlayColor)

      const res = await fetch("http://localhost:8000/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lower: lowerHSI,
          upper: upperHSI,
          image: inputImage,
          oc
        }),
      })

      const data: ProcessResponse = await res.json()

      await new Promise((resolve) => setTimeout(resolve, 2000))

      setOutputImage({ ...data.images })
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const onImageDownload = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: keyof ProcessResponse["images"]) => {
    e.preventDefault()
    if (outputImage) {
      const downloadEl = document.createElement("a")
      downloadEl.href = outputImage[key]
      downloadEl.download = `${key}.${imageName!.split(".")[1]}`
      downloadEl.click()
    }

  }

  return (
    <div className="w-screen h-screen flex flex-col gap-y-8 justify-center items-center p-8">
      <div className="flex gap-x-6 items-center">
        <img className="h-16 w-16" src={Logo} alt="logo" />
        <h1 className="text-4xl">HSI Color Detection</h1>
      </div>
      <div className="flex flex-col gap-y-3">
        <div className="flex gap-x-3 justify-between">
          <div className="flex gap-x-3 items-center">
            <p>Overlay Color:</p>
            <Input
              className=" rounded-lg animate-bounce"
              type="color"
              value={overlayColor}
              onChange={(e) => setOverlayColor(e.target.value)}
            />
          </div>

          <div className="flex gap-x-3">
            <Button
              className={`order-1 hover:-translate-y-1 duration-300
            ${imageName ? "bg-gray-500 cursor-not-allowed active:bg-gray-500 hover:bg-gray-500" : ""}
            disabled:bg-gray-500 disabled:cursor-not-allowed
          `}
              onClick={() => onAddImageClick()}
              disabled={inputImage ? true : false}
            >
              <Input
                ref={fileInputElement}
                onChange={onFileChange}
                id="file"
                className="hidden"
                type="file"
                accept="image/*"
              />

              <div className="flex items-center justify-center gap-x-1">
                <MynauiImageSolid />
                <p>Add</p>
              </div>
            </Button>
            <Button
              className={`order-2 w-[100px] duration-300
                  ${imageName && !isLoading ? "enabled:bg-blue-500 hover:bg-blue-400 hover:-translate-y-1" : ""}
                  ${(!imageName || isLoading) ? "500 disabled:bg-gray-500 500 disabled:cursor-not-allowed" : ""}
                  ${isLoading ? "disabled:bg-gray-500 disabled:cursor-not-allowed" : ""}
                `}
              onClick={() => onDetectionProcess()}
              disabled={!inputImage || isLoading}
            >
              <div className="flex items-center justify-center gap-x-1">
                {
                  isLoading ? (<div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>)
                    : <div className="flex">
                      <MynauiImageSolid />
                      <p>Detect</p>
                    </div>
                }

              </div>
            </Button>
          </div>

        </div>
        <div className="flex flex-row-reverse gap-x-6 flex-wrap-reverse gap-y-6 justify-center">
          <BoundCard
            boundType="Upper"
            hsi={upperHSI}
            onHSIValueChange={onHSIValueChange}
            rgb={upperRGB}
            hsl={upperHSL}
          />
          <BoundCard
            boundType="Lower"
            hsi={lowerHSI}
            onHSIValueChange={onHSIValueChange}
            rgb={lowerRGB}
            hsl={lowerHSL}
          />
        </div>
      </div>
      <div className="flex gap-x-12">
        {inputImage && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-x-3">
                <h1 className="flex gap-x-2 items-center justify-center">
                  <MynauiImageSolid />
                  <label className="text-md underline">{imageName}</label>
                </h1>
                <div
                  onClick={() => clearInputImage()}
                  className="p-2 bg-gray-950 rounded-xl cursor-pointer hover:animate-pulse"
                >
                  <NotoCrossMark width={20} />
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <img
                className="aspect-auto max-h-64"
                src={inputImage}
                alt="input image"
                loading="lazy"
              />
            </CardBody>
          </Card>
        )}

        {inputImage && (
          <div className="flex flex-col items-center justify-center w-1/6 ">
            <div className="flex items-center justify-center gap-x-3">
              <PepiconsPopLineX />
              <span>PROCESS</span>
              <IconoirArrowRight height={40} />
            </div>
            {outputImage && !isLoading && (null)}
          </div>
        )}

        {inputImage && (
          <div className="flex gap-x-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx: number) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-x-3">
                      <h1 className="flex gap-x-2 items-center justify-center w-full">
                        <MynauiImageSolid />
                        <div className="w-full h-4 rounded-sm bg-slate-500 animate-pulse"></div>
                      </h1>
                      <div
                        className="p-1 w-8 h-8 bg-gray-950 rounded-lg flex justify-center items-center cursor-pointer hover:animate-pulse"
                      >
                        <NotoCrossMark width={10} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="justify-center items-center h-full">
                    <div className="bg-gray-500 animate-pulse w-52 h-52 rounded-sm"></div>
                  </CardBody>
                </Card>
              ))
            ) : outputImage ? (
              Object.keys(outputImage).map((key: string, idx: number) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-x-3">
                      <h1 className="flex gap-x-2 items-center justify-center">
                        <MynauiImageSolid />
                        <label className="text-sm">{`${key}`}</label>
                      </h1>
                      <div
                        onClick={(e) => onImageDownload(e, key as keyof ProcessResponse["images"])}
                        className="p-1 w-8 h-8 bg-gray-950 rounded-lg flex justify-center items-center cursor-pointer hover:animate-pulse"
                      >
                        <FluentArrowDownload20Filled width={18} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <img
                      className="aspect-auto max-h-64"
                      src={outputImage[key as keyof typeof outputImage]}
                      alt="output image"
                      loading="lazy"
                    />
                  </CardBody>
                </Card>
              ))
            ) : null}
          </div>
        )}
      </div>

    </div>
  )
}

export default App