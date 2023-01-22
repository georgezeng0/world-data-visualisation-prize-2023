import { useState } from "react";
import ColorGradient from "./components/ColorGradient";
import MainPlot from "./components/MainPlot";
import PlotForm from "./components/PlotForm";

const initialForm = {
  plotId: "inf_vs_exp", // e.g. inf_exp
  country: "all", // Full name
};

function App() {
  const [form, setForm] = useState(initialForm);
  
  return (
    <div className="App">
      <h1>
        Title + Logo
      </h1>
      <PlotForm props={{ form, setForm }}/>
      <MainPlot props={{ form, setForm }} />
      <ColorGradient/>
    </div>
  );
}

export default App;
