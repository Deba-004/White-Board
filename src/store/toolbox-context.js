import { createContext } from "react";

const toolBoxContext = createContext({
    toolBoxState: {},
    strokeChangeHandler: () => {},
    fillChangeHandler: () => {},
    sizeChangeHandler: () => {}
});

export default toolBoxContext;