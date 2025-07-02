import classes from "./index.module.css";
import cx from "classnames";
import {
    FaSlash,
    FaRegCircle,
    FaArrowRight,
    FaPaintBrush,
    FaEraser,
    FaFont,
    FaUndo,
    FaRedo,
    FaDownload
} from "react-icons/fa";
import {LuRectangleHorizontal} from "react-icons/lu";
import { TOOL_ITEMS } from "../../constants";
import { useContext } from "react";
import boardContext from "../../store/board-context";

function ToolBar() {
    const {activeToolItem, changeToolHandler, boardUndoHandler, boardRedoHandler} = useContext(boardContext);

    function handleDownloadClick() {
        const canvas = document.getElementById("canvas");
        const dataURL = canvas.toDataURL("image/jpg");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "whiteboard.jpg";
        link.click();
    }

    return (
        <div className={classes.container}>
            <div
                className={cx(classes.toolItem, {[classes.active]: activeToolItem === TOOL_ITEMS.BRUSH})}
                onClick={() => changeToolHandler(TOOL_ITEMS.BRUSH)}
            >
                <FaPaintBrush />
            </div>
            <div
                className={cx(classes.toolItem, {[classes.active]: activeToolItem === TOOL_ITEMS.LINE})}
                onClick={() => changeToolHandler(TOOL_ITEMS.LINE)}
            >
                <FaSlash />
            </div>
            <div
                className={cx(classes.toolItem, {[classes.active]: activeToolItem === TOOL_ITEMS.RECTANGLE})}
                onClick={() => changeToolHandler(TOOL_ITEMS.RECTANGLE)}
            >
                <LuRectangleHorizontal />
            </div>
            <div
                className={cx(classes.toolItem, {[classes.active]: activeToolItem === TOOL_ITEMS.CIRCLE})}
                onClick={() => changeToolHandler(TOOL_ITEMS.CIRCLE)}
            >
                <FaRegCircle />
            </div>
            <div
                className={cx(classes.toolItem, {[classes.active]: activeToolItem === TOOL_ITEMS.ARROW})}
                onClick={() => changeToolHandler(TOOL_ITEMS.ARROW)}
            >
                <FaArrowRight />
            </div>
            <div
                className={cx(classes.toolItem, {[classes.active]: activeToolItem === TOOL_ITEMS.TEXT})}
                onClick={() => changeToolHandler(TOOL_ITEMS.TEXT)}
            >
                <FaFont />
            </div>
            <div
                className={cx(classes.toolItem, {[classes.active]: activeToolItem === TOOL_ITEMS.ERASER})}
                onClick={() => changeToolHandler(TOOL_ITEMS.ERASER)}
            >
                <FaEraser />
            </div>
            <div
                className={classes.toolItem}
                onClick={boardUndoHandler}
            >
                <FaUndo />
            </div>
            <div
                className={classes.toolItem}
                onClick={boardRedoHandler}
            >
                <FaRedo />
            </div>
            <div
                className={classes.toolItem}
                onClick={handleDownloadClick}
            >
                <FaDownload />
            </div>
        </div>
    );
}

export default ToolBar;