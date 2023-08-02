import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes/index"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <RoutesApp />
      </BrowserRouter>
    </div>
  );
}

export default App;
