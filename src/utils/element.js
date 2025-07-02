import { ARROW_HEAD_LENGTH, TOOL_ITEMS } from "../constants";
import rough from "roughjs/bin/rough";
import { arrowHeadsCoordinates, isPointNearLine } from "./math";
import { COLORS } from "../constants";
import { getStroke } from "perfect-freehand";

export function createElement(id, x1, y1, x2, y2, { type, stroke, fill, strokeWidth }) {
    const gen = rough.generator();
    const element = {
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        stroke,
        fill,
        strokeWidth
    };
    const options = {
        seed: id+1,
        fillStyle: "solid",
        stroke: stroke || COLORS.BLACK,
        fill: fill || null,
        strokeWidth: strokeWidth || 1
    }
    switch (type) {
        case TOOL_ITEMS.BRUSH: {
            const brushElement = {
                id,
                points: [{ x: x1, y: y1 }],
                path: new Path2D(getSvgPathFromStroke(getStroke([{ x: x1, y: y1 }]))),
                type,
                stroke,
            };
            return brushElement;
        }
        case TOOL_ITEMS.LINE: {
            element.roughEle = gen.line(x1, y1, x2, y2, options);
            return element;
        }
        case TOOL_ITEMS.RECTANGLE: {
            element.roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1, options);
            return element;
        }
        case TOOL_ITEMS.CIRCLE: {
            element.roughEle = gen.ellipse((x1 + x2) / 2, (y1 + y2) / 2, Math.abs(x2 - x1), Math.abs(y2 - y1), options);
            return element;
        }
        case TOOL_ITEMS.ARROW: {
            const {x3, y3, x4, y4} = arrowHeadsCoordinates(x1, y1, x2, y2, ARROW_HEAD_LENGTH);
            const pointsArr = [[x1, y1], [x2, y2], [x3, y3], [x2, y2], [x4, y4], [x2, y2]];
            element.roughEle = gen.linearPath(pointsArr, options);
            return element;
        }
        case TOOL_ITEMS.TEXT: {
            element.text = "";
            return element;
        }
        default:
            throw new Error(`Unsupported tool type: ${type}`);
    }
}

export const isPointNearElement = (element, x, y) => {
    const { type, x1, y1, x2, y2 } = element;
    const context = document.getElementById("canvas").getContext("2d");
    switch (type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.ARROW:
            return isPointNearLine(x1, y1, x2, y2, x, y);
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
            return (
                isPointNearLine(x1, y1, x2, y1, x, y) ||
                isPointNearLine(x2, y1, x2, y2, x, y) ||
                isPointNearLine(x2, y2, x1, y2, x, y) ||
                isPointNearLine(x1, y2, x1, y1, x, y)
            );
        case TOOL_ITEMS.BRUSH:
            return context.isPointInPath(element.path, x, y);
        case TOOL_ITEMS.TEXT:
            context.font = `${element.strokeWidth}px Caveat`;
            context.fillStyle = element.stroke;
            const textWidth = context.measureText(element.text).width;
            const textHeight = parseInt(element.strokeWidth);
            context.restore();
            return (
                isPointNearLine(x1, y1, x1 + textWidth, y1, x, y) ||
                isPointNearLine(x1 + textWidth, y1, x1 + textWidth, y1 + textHeight, x, y) ||
                isPointNearLine(x1 + textWidth, y1 + textHeight, x1, y1 + textHeight, x, y) ||
                isPointNearLine(x1, y1 + textHeight, x1, y1, x, y)
            );
        default:
            throw new Error("Type not recognized");
    }
}

export const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};