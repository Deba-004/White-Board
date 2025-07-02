import { useCallback, useReducer } from "react";
import { TOOL_ACTION_TYPE, TOOL_ITEMS, BOARD_ACTIONS } from "../constants";
import boardContext from "./board-context";
import { createElement, getSvgPathFromStroke, isPointNearElement } from "../utils/element";
import getStroke from "perfect-freehand";

function boardReducer(state, action) {
    switch (action.type) {
        case BOARD_ACTIONS.CHANGE_TOOL: {
            return {
                ...state,
                activeToolItem: action.payload.tool
            };
        }
        case BOARD_ACTIONS.DRAW_DOWN: {
            const {clientX, clientY, strokeColor, fillColor, strokeSize} = action.payload;
            const newEle = createElement(
                state.elements.length,
                clientX,
                clientY,
                clientX,
                clientY,
                { type: state.activeToolItem, stroke: strokeColor, fill: fillColor, strokeWidth: strokeSize }
            );
            const prevElements = state.elements;
            return {
                ...state,
                elements: [...prevElements, newEle],
                toolActionType:
                    state.activeToolItem === TOOL_ITEMS.TEXT
                    ? TOOL_ACTION_TYPE.WRITING
                    : TOOL_ACTION_TYPE.DRAWING,
            };
        }
        case BOARD_ACTIONS.DRAW_MOVE: {
            const {clientX, clientY, strokeColor, fillColor, strokeSize} = action.payload;
            const newElements = [...state.elements];
            const idx = state.elements.length-1;
            const {type} = newElements[idx];
            switch (type) {
                case TOOL_ITEMS.BRUSH:
                    newElements[idx].points.push({ x: clientX, y: clientY });
                    newElements[idx].path = new Path2D(getSvgPathFromStroke(getStroke(newElements[idx].points)));
                    return {
                        ...state,
                        elements: newElements,
                        toolActionType: TOOL_ACTION_TYPE.DRAWING
                    };
                case TOOL_ITEMS.LINE:
                case TOOL_ITEMS.RECTANGLE:
                case TOOL_ITEMS.CIRCLE:
                case TOOL_ITEMS.ARROW:
                    const {id, x1, y1} = newElements[idx];
                    const newElement = createElement(
                        id,
                        x1,
                        y1,
                        clientX,
                        clientY,
                        { type: state.activeToolItem, stroke: strokeColor, fill: fillColor, strokeWidth: strokeSize }
                    );
                    newElements[idx] = newElement;
                    return {
                        ...state,
                        elements: newElements,
                        toolActionType: TOOL_ACTION_TYPE.DRAWING
                    };
                default:
                    throw new Error("Type not recognized");
            }
        }
        case BOARD_ACTIONS.DRAW_UP: {
            const elementsCopy = [...state.elements];
            const newHistory = state.history.slice(0, state.index + 1);
            newHistory.push(elementsCopy);
            return {
                ...state,
                history: newHistory,
                index: state.index + 1
            }
        }
        case BOARD_ACTIONS.CHANGE_TEXT: {
            const {text} = action.payload;
            const idx = state.elements.length - 1;
            const newElements = [...state.elements];
            newElements[idx].text = text;

            const newHistory = state.history.slice(0, state.index + 1);
            newHistory.push(newElements);
            return {
                ...state,
                elements: newElements,
                history: newHistory,
                index: state.index + 1,
                toolActionType: TOOL_ACTION_TYPE.NONE
            }
        }
        case BOARD_ACTIONS.ERASE: {
            const {clientX, clientY} = action.payload;
            const oldElements = [...state.elements];
            const newElements = oldElements.filter((element) => {
                return !isPointNearElement(element, clientX, clientY);
            });

            if(newElements.length === oldElements.length) return state;

            const newHistory = state.history.slice(0, state.index + 1);
            newHistory.push(newElements);
            return {
                ...state,
                elements: newElements,
                history: newHistory,
                index: state.index + 1,
                toolActionType: TOOL_ACTION_TYPE.ERASING
            };
        }
        case BOARD_ACTIONS.CHANGE_ACTION_TYPE: {
            const {actionType} = action.payload;
            return {
                ...state,
                toolActionType: actionType
            };
        }
        case BOARD_ACTIONS.UNDO: {
            if(state.index <= 0) return state;
            return {
                ...state,
                elements: state.history[state.index - 1],
                index: state.index - 1
            };
        }
        case BOARD_ACTIONS.REDO: {
            if(state.index >= state.history.length-1) return state;
            return {
                ...state,
                elements: state.history[state.index + 1],
                index: state.index + 1
            };
        }
        default:
            return state;
    }
}

const initialBoardState = {
    activeToolItem: TOOL_ITEMS.BRUSH,
    toolActionType: TOOL_ACTION_TYPE.NONE,
    elements: [],
    history: [[]],
    index: 0
}

function BoardProvider({children}) {
    const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialBoardState);

    function changeToolHandler(tool) {
        dispatchBoardAction({
            type: BOARD_ACTIONS.CHANGE_TOOL,
            payload: {tool}
        });
    }

    function boardMouseDownHandler(event, toolBoxState) {
        if(boardState.toolActionType === TOOL_ACTION_TYPE.WRITING) return;
        const {clientX, clientY} = event;
        if(boardState.activeToolItem === TOOL_ITEMS.ERASER) {
            dispatchBoardAction({
                type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
                payload: {actionType: TOOL_ACTION_TYPE.ERASING}
            });
            return;
        }
        const strokeColor = toolBoxState[boardState.activeToolItem].stroke;
        const fillColor = toolBoxState[boardState.activeToolItem].fill;
        const strokeSize = toolBoxState[boardState.activeToolItem].size;
        dispatchBoardAction({
            type: BOARD_ACTIONS.DRAW_DOWN,
            payload: {clientX, clientY, strokeColor, fillColor, strokeSize}
        });
    }

    function boardMouseMoveHandler(event, toolBoxState) {
        if(boardState.toolActionType === TOOL_ACTION_TYPE.WRITING) return;
        const {clientX, clientY} = event;
        if(boardState.toolActionType === TOOL_ACTION_TYPE.DRAWING) {
            const strokeColor = toolBoxState[boardState.activeToolItem].stroke;
            const fillColor = toolBoxState[boardState.activeToolItem].fill;
            const strokeSize = toolBoxState[boardState.activeToolItem].size;
            dispatchBoardAction({
                type: BOARD_ACTIONS.DRAW_MOVE,
                payload: {clientX, clientY, strokeColor, fillColor, strokeSize}
            });
        } else if(boardState.toolActionType === TOOL_ACTION_TYPE.ERASING) {
            dispatchBoardAction({
                type: BOARD_ACTIONS.ERASE,
                payload: {clientX, clientY}
            })
        }
    }

    function boardMouseUpHandler() {
        if(boardState.toolActionType === TOOL_ACTION_TYPE.WRITING) return;
        if(boardState.toolActionType === TOOL_ACTION_TYPE.DRAWING) {
            dispatchBoardAction({
                type: BOARD_ACTIONS.DRAW_UP
            });
        }
        dispatchBoardAction({
            type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
            payload: {actionType: TOOL_ACTION_TYPE.NONE}
        })
    }

    function textAreaBlurHandler(text) {
        dispatchBoardAction({
            type: BOARD_ACTIONS.CHANGE_TEXT,
            payload: {text}
        });
    }

    const boardUndoHandler = useCallback(() => {
        dispatchBoardAction({
            type: BOARD_ACTIONS.UNDO
        });
    }, []);

    const boardRedoHandler = useCallback(() => {
        dispatchBoardAction({
            type: BOARD_ACTIONS.REDO
        });
    }, []);

    const boardContextValue = {
        activeToolItem: boardState.activeToolItem,
        toolActionType: boardState.toolActionType,
        elements: boardState.elements,
        changeToolHandler,
        boardMouseDownHandler,
        boardMouseMoveHandler,
        boardMouseUpHandler,
        textAreaBlurHandler,
        boardUndoHandler,
        boardRedoHandler
    }

    return (
        <boardContext.Provider value={boardContextValue}>{children}</boardContext.Provider>
    )
}

export default BoardProvider;