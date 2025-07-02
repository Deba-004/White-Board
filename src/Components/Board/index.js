import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPE, TOOL_ITEMS } from "../../constants";
import toolBoxContext from "../../store/toolbox-context";
import classes from "./index.module.css";

function Board() {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const {
    toolActionType,
    elements,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    boardUndoHandler,
    boardRedoHandler
  } = useContext(boardContext);
  const {toolBoxState} = useContext(toolBoxContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);
  
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((ele) => {
      switch (ele.type) {
        case TOOL_ITEMS.BRUSH:
          context.fillStyle = ele.stroke;
          context.fill(ele.path);
          context.restore();
          break;
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          roughCanvas.draw(ele.roughEle);
          break;
        case TOOL_ITEMS.TEXT:
          context.textBaseline = "top";
          context.font = `${ele.strokeWidth}px Caveat`;
          context.fillStyle = ele.stroke;
          context.fillText(ele.text, ele.x1, ele.y1);
          context.restore();
          break;
        default:
          throw new Error("Type not recognized");
      }
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [elements]);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if(toolActionType === TOOL_ACTION_TYPE.WRITING) {
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [toolActionType]);

  useEffect(() => {
    function handleKeyDown(event) {
      if(event.ctrlKey && event.key === "z") {
        boardUndoHandler();
      } else if(event.ctrlKey && event.key === "y") {
        boardRedoHandler();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [boardUndoHandler, boardRedoHandler]);

  function handleMouseDown(event) {
    boardMouseDownHandler(event, toolBoxState);
  }

  function handleMouseMove(event) {
    boardMouseMoveHandler(event, toolBoxState);
  }

  function handleMouseUp() {
    boardMouseUpHandler();
  }

  return (
    <>
      {toolActionType === TOOL_ACTION_TYPE.WRITING && <textarea
        className={classes.textArea}
        ref={textAreaRef}
        style={{
          top: elements[elements.length - 1]?.y1 || "50%",
          left: elements[elements.length - 1]?.x1 || "50%",
          fontSize: `${elements[elements.length - 1]?.strokeWidth || 16}px`,
          color: elements[elements.length - 1]?.stroke || "#000000",
        }}
        onBlur={(event) => textAreaBlurHandler(event.target.value)}
      />}
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
}

export default Board;