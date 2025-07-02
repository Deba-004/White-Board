import { useReducer } from "react";
import toolBoxContext from "./toolbox-context";
import { TOOL_ITEMS, COLORS, TOOLBOX_ACTIONS} from "../constants";

function toolBoxReducer(state, action) {
    switch (action.type) {
        case TOOLBOX_ACTIONS.STROKE_CHANGE: {
            const { tool, color } = action.payload;
            return {
                ...state,
                [tool]: {
                    ...state[tool],
                    stroke: color
                }
            };
        }
        case TOOLBOX_ACTIONS.FILL_CHANGE: {
            const {tool, color} = action.payload;
            return {
                ...state,
                [tool]: {
                    ...state[tool],
                    fill: color
                }
            };
        }
        case TOOLBOX_ACTIONS.SIZE_CHANGE: {
            const {tool, size} = action.payload;
            return {
                ...state,
                [tool]: {
                    ...state[tool],
                    size: size
                }
            };
        }
        default:
            return state;
    }
}

const initialToolBoxState = {
    [TOOL_ITEMS.BRUSH]: {
        stroke: COLORS.BLACK
    },
    [TOOL_ITEMS.LINE]: {
        stroke: COLORS.BLACK,
        size: 1
    },
    [TOOL_ITEMS.RECTANGLE]: {
        stroke: COLORS.BLACK,
        size: 1,
        fill: null
    },
    [TOOL_ITEMS.CIRCLE]: {
        stroke: COLORS.BLACK,
        size: 1,
        fill: null
    },
    [TOOL_ITEMS.ARROW]: {
        stroke: COLORS.BLACK,
        size: 1
    },
    [TOOL_ITEMS.TEXT]: {
        stroke: COLORS.BLACK,
        size: 32
    }
};

function ToolBoxProvider({children}) {
    const [toolBoxState, dispatchToolBoxAction] = useReducer(toolBoxReducer, initialToolBoxState);

    function strokeChangeHandler(tool, color) {
        dispatchToolBoxAction({
            type: TOOLBOX_ACTIONS.STROKE_CHANGE,
            payload: {
                tool,
                color
            }
        });
    }

    function fillChangeHandler(tool, color) {
        dispatchToolBoxAction({
            type: TOOLBOX_ACTIONS.FILL_CHANGE,
            payload: {
                tool,
                color
            }
        });
    }

    function sizeChangeHandler(tool, size) {
        dispatchToolBoxAction({
            type: TOOLBOX_ACTIONS.SIZE_CHANGE,
            payload: {
                tool,
                size
            }
        });
    }

    const toolBoxContextValue = {
        toolBoxState,
        strokeChangeHandler,
        fillChangeHandler,
        sizeChangeHandler
    };

    return (
        <toolBoxContext.Provider value={toolBoxContextValue}>{children}</toolBoxContext.Provider>
    );
}

export default ToolBoxProvider;