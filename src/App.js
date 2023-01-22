import { useState } from "react";
import ColorGradient from "./components/ColorGradient";
import Footer from "./components/Footer";
import MainPlot from "./components/MainPlot";
import PlotForm from "./components/PlotForm";

const initialForm = {
  plotId: "inf_vs_exp", // e.g. inf_exp
  country: "all", // Full name
};

function App() {
  const [form, setForm] = useState(initialForm);

  return (
    <main className="App">
      <header>
        <h1>Health Spending Dashboard - How Efficient Is Your Country?</h1>
        <img
          src="/WGS-World-Government-Summit-Logo/WGS-summit-logo.svg"
          alt="World Governemnt Summit Logo"
        />
      </header>

      <PlotForm props={{ form, setForm }} />

      <div className="plot-container">
        <MainPlot props={{ form, setForm }} />
      </div>

      {form.country === "all" && (
        <div className="gradient-container">
          <ColorGradient />
        </div>
      )}

      <div className="information">
        <h2>Information</h2>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit nam quo
          odio non ratione recusandae accusantium rem est, voluptas commodi
          neque? Ut, ipsa. Quas corporis omnis sequi molestiae earum architecto.
        </p>
      </div>
      <Footer/>
    </main>
  );
}

export default App;
