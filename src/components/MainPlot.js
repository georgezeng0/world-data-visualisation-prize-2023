import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import data from "../data/plot_data.json";
import inf_exp_data from "../data/inf_exp.json";
import mat_exp_data from "../data/mat_exp.json";
import life_exp_data from "../data/life_exp.json";
import countries from "../data/countries";

const MainPlot = ({ props: { form, setForm } }) => {
  const dataDict = {
    inf_vs_exp: inf_exp_data,
    mat_vs_exp: mat_exp_data,
    life_vs_exp: life_exp_data,
  };
  const titles = {
    inf_vs_exp: "inf_exp_data",
    mat_vs_exp: "mat_exp_data",
    life_vs_exp: "life_exp_data",
  };

  const [dataArray, setDataArray] = useState(dataDict[form.plotId].data);
  const [annotations, setAnnotations] = useState([]);

  useEffect(() => {
    const dataSrc = dataDict[form.plotId].data;
    const country = form.country;
    const allCountriesTrace = { ...dataSrc[0] };
    const fittedTrace = { ...dataSrc[1] };
    const filteredTrace = {
      x: [],
      y: [],
      text: [],
      textposition: "top center",
      type: "scatter",
      mode: "markers+text",
      name: "",
      hoverinfo: "text",
      marker: { color: "red", size: "12" },
    };

    if (country !== "all") {
      // Reduce opacity of all countries
      allCountriesTrace.marker.opacity = 0.1;

      // Find index of label containing the country name
      const countryIndex = allCountriesTrace.text.findIndex((s) =>
        s.includes(country)
      );
      if (
        !allCountriesTrace.x[countryIndex] ||
        !allCountriesTrace.y[countryIndex]
      ) {
        setAnnotations([
          {
            text: "Missing data for this country",
            xref: "paper",
            yref: "paper",
            x: 1,
            y: 1,
            showarrow: false,
          },
        ]);
      } else {
        filteredTrace.x = [allCountriesTrace.x[countryIndex]];
        filteredTrace.y = [allCountriesTrace.y[countryIndex]];
        filteredTrace.text = [country];
        setAnnotations([]);
      }
    } else {
      allCountriesTrace.marker.opacity = 1;
      setAnnotations([]);
    }

    setDataArray([allCountriesTrace, fittedTrace, filteredTrace]);
  }, [form]);

  return (
    <Plot
      data={dataArray}
      layout={{
        width: 900,
        height: 600,
        title: titles[form.plotId],
        showlegend: false,
        annotations: annotations,
      }}
      config={{ displaylogo: false }}
    />
  );
};

export default MainPlot;

// DELETE ON PRODUCTION IF NOT USED:
const RawPlot = () => {
  const health_exp_z_transformed = data.map(
    (item) => item.healthexp_usd_percap_2019_z_transformed
  );
  const infant_mort_z_transformed = data.map(
    (item) => item.infant_mort_2020_z_transformed
  );
  const countries = data.map((item) => item.country);

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
        },
      ]}
      layout={{ width: 900, height: 600, title: "Using React Plotly" }}
    />
  );
};
