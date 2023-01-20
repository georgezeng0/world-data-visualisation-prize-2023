import React from "react";
import Plot from "react-plotly.js";
import data from "../data/plot_data.json"
import inf_exp from "../data/inf_exp.json"

const MainPlot = () => {
  
  const health_exp_z_transformed = data.map(item=>item.healthexp_usd_percap_2019_z_transformed)
  const infant_mort_z_transformed = data.map(item => item.infant_mort_2020_z_transformed)
  const countries = data.map(item => item.country)
  
  return (
    <Plot
      data={inf_exp.data}
      layout={{ width: 900, height: 600, title: "Using React Plotly" }}
    />
  )

  return (
    <Plot
      data={[
        {
          x: health_exp_z_transformed,
          y: infant_mort_z_transformed,
          type: "scatter",
          mode: "markers",
          text: countries,
          hoverinfo: "text",
          marker: { color: "red" },
        }
      ]}
      layout={{ width: 900, height: 600, title: "Using React Plotly" }}
    />
  );
};

export default MainPlot;
