import { ELEMENT_ERASE_THRESHOLD } from "../constants";

export const arrowHeadsCoordinates = (x1, y1, x2, y2, headLength) => {
    const arrowAngle = Math.atan2(y2 - y1, x2 - x1);

    const x3 = x2 - headLength * Math.cos(arrowAngle - Math.PI / 6);
    const y3 = y2 - headLength * Math.sin(arrowAngle - Math.PI / 6);
    const x4 = x2 - headLength * Math.cos(arrowAngle + Math.PI / 6);
    const y4 = y2 - headLength * Math.sin(arrowAngle + Math.PI / 6);

    return {
        x3,
        y3,
        x4,
        y4
    };
};

const distanceBetweenPoints = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export const isPointNearLine = (x1, y1, x2, y2, pointX, pointY) => {
    const distToStart = distanceBetweenPoints(x1, y1, pointX, pointY);
    const distToEnd = distanceBetweenPoints(x2, y2, pointX, pointY);
    const lineLength = distanceBetweenPoints(x1, y1, x2, y2);
    return Math.abs(distToStart + distToEnd - lineLength) < ELEMENT_ERASE_THRESHOLD;
}