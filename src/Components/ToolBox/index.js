import { COLORS, FILL_TOOL_TYPES, STROKE_TOOL_TYPES, SIZE_TOOL_TYPES, TOOL_ITEMS } from "../../constants";
import classes from "./ToolBox.module.css";
import cx from "classnames";
import { useContext } from "react";
import toolBoxContext from "../../store/toolbox-context";
import boardContext from "../../store/board-context";

function ToolBox() {
  const {toolBoxState, strokeChangeHandler, fillChangeHandler, sizeChangeHandler} = useContext(toolBoxContext);
  const {activeToolItem} = useContext(boardContext);

  const strokeColor = toolBoxState[activeToolItem]?.stroke || COLORS.BLACK;
  const fillColor = toolBoxState[activeToolItem]?.fill || null;
  const strokeSize = toolBoxState[activeToolItem]?.size || 1;

  function handleStrokeColorChange(tool, color) {
    strokeChangeHandler(tool, color);
  }

  function handleFillColorChange(tool, color) {
    fillChangeHandler(tool, color);
  }

  return (
    <div className={classes.container}>
      {STROKE_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
        <div className={classes.toolBoxLabel}>
          {activeToolItem === TOOL_ITEMS.TEXT ? "Font Color" : "Stroke Color"}
        </div>
        <div className={classes.colorBoxContainer}>
          <div>
            <input
              className={classes.colorPicker}
              type="color"
              value={strokeColor}
              onChange={(event) => handleStrokeColorChange(activeToolItem, event.target.value)}
            />
          </div>
          {Object.keys(COLORS).map((k) => {
            return (
              <div
                key={k}
                className={cx(classes.colorBox, {[classes.activeColorBox]: strokeColor === COLORS[k]})}
                style={{backgroundColor: COLORS[k]}}
                onClick={() => handleStrokeColorChange(activeToolItem, COLORS[k])}
              ></div>
            );
          })}
        </div>
      </div>}
      {FILL_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
        <div className={classes.toolBoxLabel}>Fill Color</div>
        <div className={classes.colorBoxContainer}>
          {fillColor === null ? (
            <div
              className={cx(classes.colorPicker, classes.noFillColorBox)}
              onClick={() => handleFillColorChange(activeToolItem, COLORS.BLACK)}
            ></div>
          ) : (
            <div>
              <input
                className={classes.colorPicker}
                type="color"
                value={fillColor}
                onChange={(event) => handleFillColorChange(activeToolItem, event.target.value)}
              />
            </div>
          )}
          <div
            className={cx(classes.colorBox, classes.noFillColorBox, {[classes.activeColorBox]: fillColor === null})}
            onClick={() => handleFillColorChange(activeToolItem, null)}
          ></div>
          {Object.keys(COLORS).map((k) => {
            return (
              <div
                key={k}
                className={cx(classes.colorBox, {[classes.activeColorBox]: fillColor === COLORS[k]})}
                style={{backgroundColor: COLORS[k]}}
                onClick={() => handleFillColorChange(activeToolItem, COLORS[k])}
              ></div>
            );
          })}
        </div>
      </div>}
      {SIZE_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
        <label className={classes.toolBoxLabel}>
          {activeToolItem === TOOL_ITEMS.TEXT ? "Font Size" : "Stroke Size"}
        </label>
        <input
          type="range"
          min={activeToolItem === TOOL_ITEMS.TEXT ? 12 : 1}
          max={activeToolItem === TOOL_ITEMS.TEXT ? 64 : 10}
          step={1}
          value={strokeSize}
          onChange={(event) => sizeChangeHandler(activeToolItem, event.target.value)}
        />
      </div>}
    </div>
  )
}

export default ToolBox;