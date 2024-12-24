import Card from "./components/card/card"
import CardHeader from "./components/card/card-header"
import logo from './assets/logo.png'
import CardBody from "./components/card/card-body"
import Input from "./components/input"
import { ChangeEvent, HTMLAttributes } from "react"
import Button from "./components/button"
import { ChromePicker } from "react-color"
import { useState } from "react"
import { MynauiImageSolid, NotoCrossMark } from "./components/icon"

function App() {
  const [color, setColor] = useState<string>("")
  const [isPopup, setIsPopup] = useState<boolean>(false)
  const [inputImage, setInputImage] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [hsi, setHSI] = useState<HSIColor>({
    h: Math.floor(Math.random() * 360),
    s: Math.random(),
    i: Math.floor(Math.random() * 255)
  })
  const [hsl, setHSL] = useState<HSLColor>({
    h: hsi.h,
    l: hsi.i * ((1 + hsi.s) / 2),
    s: hsi.i * ((1 + hsi.s) / 2) > 0 ? (hsi.s * hsi.i) / hsi.i * ((1 + hsi.s) / 2) : 0
  })

  const onAddImageClick = () => document.getElementById("file")?.click()

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      console.log(file)
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
  }

  const attrs = [
    {
      name: "h",
      placeholder: "0 - 360",
      range: {
        min: "0",
        max: "360",
        name: "range-h"
      },
      boxCSS: "bg-hue-gradient"
    },
    {
      name: "s",
      placeholder: "0 - 1",
      range: {
        min: "0",
        max: "1",
        name: "range-s"
      },
      boxCSS: `linear-gradient(to right, hsl(0, 0%, 50%), hsl(${hsl.h}, ${hsl.s * 100}%, 50%))`
    },
    {
      name: "i",
      placeholder: "0 - 255",
      range: {
        min: "0",
        max: "255",
        name: "range-i"
      },
      boxCSS: `linear-gradient(to right, hsl(0, ${hsl.s * 100}%, 0%), hsl(${hsl.h}, ${hsl.s * 100}%, 100%))`
    },
  ]

  const cvtHSI_RGB = (hsi: HSIColor) => {
    
  }

  const cvtHSI = (hsi: HSIColor) => {
    setHSL({
      h: hsi.h,
      l: hsi.i * ((1 + hsi.s) / 2),
      s: hsi.i * ((1 + hsi.s) / 2) > 0 ? (hsi.s * hsi.i) / hsi.i * ((1 + hsi.s) / 2) : 0
    })
  }

  const onHSIValueChange = (e: ChangeEvent<HTMLInputElement>, name: "h" | "s" | "i") => {
    setHSI((prev) => ({
      ...prev,
      [name]: e.target.value == "" ? 0 : name === "s" ? parseFloat(e.target.value) : parseInt(e.target.value, 10),
    }))
    cvtHSI(hsi)
  }

  return (
    <div className="w-screen h-screen flex flex-col gap-y-6 justify-center items-center">
      <div className="flex gap-x-6">
        <Card className="p-8 gap-y-6">
          <CardHeader>
            <div className="flex items-center justify-center gap-x-3">
              <img className="w-9 h-9" src={logo} alt="logo" />
              <h1 className="text-3xl">HSI Color Detection</h1>
            </div>
          </CardHeader>
          <CardBody className="gap-y-6 ">
            <form className="flex flex-col gap-y-3">
              <div className="flex gap-x-6">
                {
                  attrs.map((attr, idx) => (
                    <div className="flex flex-col gap-y-2" key={idx}>
                      <div className="flex gap-x-2 w-[250px] justify-between items-center">
                        <label className="text-lg">{attr.name.toUpperCase()}:</label>
                        <Input
                          onChange={(e) => onHSIValueChange(e, attr.name as keyof typeof hsi)}
                          value={hsi[attr.name as keyof typeof hsi]}
                          className=" text-center w-[60px] placeholder:text-sm placeholder:text-center"
                          {...attr as Partial<HTMLAttributes<HTMLInputElement>>}
                        />
                      </div>
                      <div className="flex flex-col gap-y-5">
                        <Input
                          className="w-full h-3 p-0"
                          step={attr.name == "s" ? 0.1 : 1}
                          onChange={(e) => onHSIValueChange(e, attr.name as keyof typeof hsi)}
                          value={hsi[attr.name as keyof typeof hsi]}
                          {...attr.range}
                          type="range"
                        />
                        <div
                          className={`h-5 ${attr.name == "h" && attr.boxCSS}`}
                          style={{
                            background: attr.name == "h" ? "" : attr.boxCSS
                          }}
                        >

                        </div>
                      </div>

                    </div>
                  ))
                }
              </div>

            </form>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-x-3">
                <div className="w-5 h-5 " style={{ background: `hsl(${hsl.h}, ${hsl.s * 100}%, ${hsl.l}%)` }}>
                </div>
                <label>HSL: ({hsl.h}, {hsl.s}%, {hsl.l}%)</label>
              </div>
              <div className="flex gap-x-3">
                <Input className="opacity-0" type="color" id="color_picker" />
                <Button onClick={() => document.getElementById("color_picker")?.click()}>
                  Color Picker
                </Button>
              </div>

            </div>
          </CardBody>
        </Card>
        <div className="flex flex-col gap-y-3">
          <Button className={`${imageName && 'bg-gray-500 cursor-not-allowed active:bg-gray-500 hover:bg-gray-500'}`} onClick={() => onAddImageClick()} disabled={inputImage ? true : false}>
            <Input onChange={onFileChange} id="file" className="hidden" type="file" accept="image/png, image/jpg" />
            <div className="flex items-center justify-center gap-x-1">
              <MynauiImageSolid />
              <label>Add</label>
            </div>
          </Button>
          <Card className="p-4 h-fit">
            <CardHeader>
              <div className="flex items-center justify-center gap-x-3">
                <h1 className="text-lg underline">Represent</h1>
              </div>
            </CardHeader>
            <CardBody className="text-sm" >
              <p>H: HUE</p>
              <p>S: Saturation</p>
              <p>I: Intensity</p>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="flex gap-x-8">
        {inputImage &&
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-x-3">
                <h1 className="flex gap-x-2 items-center justify-center">
                  <MynauiImageSolid />
                  <label className="text-md underline">{imageName}</label>
                </h1>
                <div onClick={() => clearInputImage()} className="p-2 bg-gray-950 rounded-xl cursor-pointer hover:animate-pulse">
                  <NotoCrossMark width={20} />
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <img className="aspect-auto max-h-64" src={inputImage!} alt="input images" />
            </CardBody>
          </Card>}
      </div>

    </div>
  )
}

export default App
