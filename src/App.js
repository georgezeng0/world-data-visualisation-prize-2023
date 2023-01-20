import { useState } from "react";
import MainPlot from "./components/MainPlot";
import PlotContainer from "./components/PlotContainer";
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
      <MainPlot props={{ form, setForm }}/>
      <PlotContainer props={{ form, setForm }} />
    </div>
  );
}

export default App;
