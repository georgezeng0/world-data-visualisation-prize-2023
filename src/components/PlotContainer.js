import React, { useState } from "react";
import PlotForm from "./PlotForm";
import PlotOutput from "./PlotOutput";

const initialForm = {
  plotId: "inf_vs_exp", // e.g. inf_exp
  title: "",
  country: "", // 3 letter code
};

const PlotContainer = () => {
  const [form, setForm] = useState(initialForm);

  return (
    <div>
      <h2>Plotly R iframe html</h2>
      <PlotForm props={{ form, setForm: setForm }} />
      <PlotOutput props={{ form }} />
    </div>
  );
};

export default PlotContainer;
