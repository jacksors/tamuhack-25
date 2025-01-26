"use client";
import { useState, useEffect } from "react";

interface CarSpinnerProps {
  model: string;
  modelTag: string;
  modelGrade: string;
  colorCodes: string;
  imageIndexOverride?: number;
  imageCountOverride?: number;
  card?: boolean;
}

const CarSpinner: React.FC<CarSpinnerProps> = ({
  model,
  modelTag,
  modelGrade,
  colorCodes,
  imageIndexOverride,
  imageCountOverride,
  card,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(10);
  const [isMouseInside, setIsMouseInside] = useState(false);
  const [randomColor, setRandomColor] = useState("");
  const [randomModelGrade, setRandomModelGrade] = useState("");
  const [randomModelTag, setRandomModelTag] = useState("");
  const [imageCount, setImageCount] = useState(36);
  const [year, setYear] = useState("2025");
  const [modelName, setModelName] = useState("");

  useEffect(() => {
    if (
      imageCountOverride !== undefined &&
      imageCountOverride > 0 &&
      Number.isInteger(imageCountOverride)
    ) {
      setImageCount(imageCountOverride);
    } else {
      setImageCount(36);
    }
  }, [imageCountOverride]);

  useEffect(() => {
    if (
      imageIndexOverride !== undefined &&
      imageIndexOverride >= 0 &&
      imageIndexOverride < imageCount
    ) {
      setCurrentImageIndex(imageIndexOverride);
    } else if (imageIndexOverride !== undefined) {
      setCurrentImageIndex(17);
    }
  }, [imageIndexOverride, imageCount]);


  useEffect(() => {
    if (model.split(" ")[1]?.toLowerCase() === "highlander") {
      console.log("highlander: ", model);
      setModelName("grandhighlander");
    } else if (model.split(" ")[0]?.toLowerCase() === "gr") {
      setModelName(model.replace(" ", "").toLowerCase());
    } else if (model.split(" ")[0]?.toLowerCase() === "crown") {
      setModelName("toyotacrown");
    } else if (model.split(" ")[0]?.toLowerCase() === "land") {
      setModelName("landcruiser");
    }
    else {
      setModelName(model.split(" ")[0]?.toLowerCase() || "");
    }

    if (model.split(" ")[0]?.toLowerCase() === "venza") {
      setYear("2024");
    }
  }, [model]);

  useEffect(() => {
    const colorCodeArray = colorCodes
      .split(",")
      .map((color) => color.trim().toLowerCase());
    const modelGradeArray = modelGrade
      .split(",")
      .map((grade) => grade.trim());
    let modelTagArray: string[] = [];
    if (modelTag) {
      modelTagArray = modelTag.split(",").map((tag) => tag.trim());
    }
    const randomIndex = Math.floor(Math.random() * colorCodeArray.length);
    setRandomColor(colorCodeArray[randomIndex] || "");
    setRandomModelGrade(modelGradeArray[randomIndex] || "");
    setRandomModelTag(modelTagArray[randomIndex] || "");
  }, [colorCodes, modelGrade, modelTag]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("handleMouseMove");
    if (isMouseInside && imageIndexOverride === undefined) {

      const { offsetWidth, offsetLeft } = e.currentTarget;
      const relativeX = e.clientX - offsetLeft;
      const percentage = relativeX / offsetWidth + 0.4;
      const newIndex = Math.floor(percentage * imageCount) % imageCount;
      setCurrentImageIndex(newIndex);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsMouseInside(true)}
      onMouseLeave={() => setIsMouseInside(false)}
      onMouseMove={handleMouseMove}
      className={`flex ${card ? "h-full w-auto" : "h-full w-auto"} items-center justify-center overflow-hidden`}
    >
      <img
        src={`https://tmna.aemassets.toyota.com/is/image/toyota/toyota/jellies/max/${year}/${modelName}/${randomModelGrade}/${randomModelTag}/${randomColor}/${imageCount}/${currentImageIndex}.png?fmt=webp-alpha&wid=930&qlt=90`}
        alt="Spinning Car"
        className={`${card ? "h-full w-full py-12" : "h-[50%]"}`}
      />
    </div>
  );
};

export default CarSpinner;
