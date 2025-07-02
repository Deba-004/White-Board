import Board from "./Components/Board";
import ToolBar from "./Components/ToolBar";
import ToolBox from "./Components/ToolBox";
import BoardProvider from "./store/BoardProvider";
import ToolBoxProvider from "./store/ToolBoxProvider";

function App() {
  return (
    <>
      <BoardProvider>
        <ToolBoxProvider>
          <ToolBar />
          <Board />
          <ToolBox />
        </ToolBoxProvider>
      </BoardProvider>
    </>
  );
}

export default App;