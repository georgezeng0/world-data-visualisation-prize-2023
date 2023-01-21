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
  const metrics = {
    inf_vs_exp: "Infant Mortality (per 1,000 live births)",
    mat_vs_exp: "Maternal Mortality (per 100,000 live births)",
    life_vs_exp: "Life Expectancy (years)",
  };

  const [dataArray, setDataArray] = useState(dataDict[form.plotId].data);
  const [annotations, setAnnotations] = useState([]);

  useEffect(() => {
    const dataSrc = dataDict[form.plotId].data; // Gets the data array from named source
    const country = form.country;

    const allCountriesTrace = { ...dataSrc[0] }; // 1st trace in the data array
    allCountriesTrace.name = "all_countries";

    const fittedTrace = { ...dataSrc[1] }; // 2nd trace in the data array

    //fittedTrace.hoverinfo = "x+y";

    // Create overlying trace when selecting a country:
    const filteredTrace = {
      x: [],
      y: [],
      text: [],
      textposition: "top center", // if below fitted line > will change to bottom center
      type: "scatter",
      mode: "markers+text",
      name: "",
      hoverinfo: "none",
      marker: { color: "red", size: "12" },
    };

    // Vertical line trace when selecting a country:
    const vLineTrace = {
      x: [],
      y: [],
      text: [],
      type: "scatter",
      mode: "lines",
      name: "",
      hoverinfo: "none",
      marker: { color: "red", size: "6" },
    };

    // If filtered for country:
    if (country !== "all") {
      // Reduce opacity of all countries
      allCountriesTrace.marker.opacity = 0.1;

      // Find index of label containing the country name
      const countryIndex = allCountriesTrace.text.findIndex((s) =>
        s.includes(country)
      );
      // If missing x or y datapoints
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
      }
      // No missing x or y datapoints
      else {
        const countryX = allCountriesTrace.x[countryIndex];
        const countryY = allCountriesTrace.y[countryIndex];

        // Get the closest point on the regression line
        const closestFittedX = fittedTrace.x.reduce((a, b) => {
          return Math.abs(b - countryX) < Math.abs(a - countryX) ? b : a;
        });
        const closestFittedIndex = fittedTrace.x.indexOf(closestFittedX);

        const fittedY = fittedTrace.y[closestFittedIndex];

        // Highlight marker
        filteredTrace.x = [countryX];
        filteredTrace.y = [countryY];
        filteredTrace.text = [country];
        filteredTrace.textposition =
          countryY > fittedY ? "top center" : "bottom center";

        // Vertical line
        vLineTrace.x = [countryX, countryX];
        vLineTrace.y = [countryY, fittedY];

        // Annotation for country
        const [metric_text, exp_text, country_text] =
          allCountriesTrace.text[countryIndex].split("<br />");
        

        setAnnotations([
          {
            text:
              `<b>${country_text}</b>` +
              `<br>${metric_text}` +
              `<br>${exp_text}`,
            xref: "paper",
            yref: "paper",
            align: "right",
            x: 1,
            y: 1,
            showarrow: false,
          },
        ]);
      }
    }
    // Show all countries - reset annotations and styles
    else {
      allCountriesTrace.marker.opacity = 1;
      setAnnotations([]);
    }

    // Update data array whenever form input changes
    setDataArray([allCountriesTrace, fittedTrace, filteredTrace, vLineTrace]);
  }, [form]);

  const handleClick = (e) => {
    const clickedPoint = e.points[0];
    // If all countries trace
    if (clickedPoint.data.name === "all_countries") {
      const [country] = clickedPoint.text.match(/(?<=Country: ).*/g); //Match everything after "Country: "
      // Set country input to country clicked (checks if valid after regex check)
      if (countries.indexOf(country) >= 0) {
        setForm({ ...form, country });
      }
    }
  };

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
      onClick={handleClick}
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
