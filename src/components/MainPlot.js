import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
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
    inf_vs_exp: {
      title: "Infant Mortality vs Health Expediture",
      x_title: "Log Health Expediture",
      y_title: "Log Infant Mortality",
    },
    mat_vs_exp: {
      title: "Maternal Mortality vs Health Expediture",
      x_title: "Log Health Expediture",
      y_title: "Log Maternal Mortality",
    },
    life_vs_exp: {
      title: "Life Expectancy vs Health Expenditure",
      x_title: "Log Health Expediture",
      y_title: "Life Expectancy",
    },
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
    allCountriesTrace.name = "Country";
    allCountriesTrace.showlegend = true;

    const fittedTrace = { ...dataSrc[1] }; // 2nd trace in the data array
    fittedTrace.name = "Fitted Line";
    fittedTrace.showlegend = true;

    //fittedTrace.hoverinfo = "x+y";

    // Create overlying trace when selecting a country:
    const filteredTrace = {
      x: [],
      y: [],
      text: [],
      textposition: "top center", // if below fitted line > will change to bottom center
      type: "scatter",
      mode: "markers+text",
      name: "Selected Country",
      showlegend: true,
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
      showlegend: false,
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
            font: {
              size: 18,
            },
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
            y: form.plotId === "life_vs_exp" ? 0.2 : 1,
            showarrow: false,
            font: {
              size: 18,
            },
          },
        ]);
      }
    }
    // Show all countries - reset annotations and styles
    else {
      allCountriesTrace.marker.opacity = 1;

      // For each country, set colour depending on distance to closest point on fitted trace
      const colorscale = [
        [0, "green"],
        [0.3, "green"],
        [0.5, "blue"],
        [0.6, "red"],
        [1.0, "red"],
      ];

      const closestFittedYArray = allCountriesTrace.x.map((countryX) => {
        const closestFittedX = fittedTrace.x.reduce((a, b) => {
          return Math.abs(b - countryX) < Math.abs(a - countryX) ? b : a;
        });
        const closestFittedIndex = fittedTrace.x.indexOf(closestFittedX);
        const fittedY = fittedTrace.y[closestFittedIndex];
        return fittedY;
      });

      const colors = allCountriesTrace.y.map((countryY, i) => {
        const fittedY = closestFittedYArray[i];
        const diff = countryY - fittedY;
        return diff;
      });

      allCountriesTrace.marker =
        form.plotId === "life_vs_exp"
          ? // marker for life expectancy
            {
              ...allCountriesTrace.marker,
              //colorscale: "Portland",
              colorscale: colorscale,
              autocolorscale: false,
              cauto: false,
              // Custom color scale as raw data is not standardised
              cmid: 0,
              cmax: 4,
              cmin: -4,
              color: colors,
              line: undefined,
              //showscale: true
            }
          : // marker for infant mortality and maternal mortality
            {
              ...allCountriesTrace.marker,
              //colorscale: "Portland",
              colorscale: colorscale,
              autocolorscale: false,
              cauto: true,
              color: colors,
              line: undefined,
            };

      setAnnotations([]);
    }

    // Update data array whenever form input changes
    setDataArray([allCountriesTrace, fittedTrace, filteredTrace, vLineTrace]);
  }, [form]);

  const handleClick = (e) => {
    const clickedPoint = e.points[0];
    // If all countries trace
    if (clickedPoint.data.name === "Country") {
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
        //font
        font: {
          family: "Arial",
          size: 14,
        },
        // Margins
        margin: {
          autoexpand: true,
          r: 0,
          t: 70,
          b: 0,
          l: 0,
        },
        // Axes
        xaxis: {
          title: {
            text: `<b>${titles[form.plotId].x_title}</b>`,
            font: {
              //color: '',
              size: 22,
            },
            //standoff: 100
          },
          automargin: true,
          showticklabels: false,
          zeroline: false,
          showgrid: false,
          //showline: true
        },
        yaxis: {
          title: {
            text: `<b>${titles[form.plotId].y_title}</b>`,
            font: {
              //color: '',
              size: 22,
            },
            //standoff: 50
          },
          automargin: true,
          showticklabels: false,
          zeroline: false,
          showgrid: false,
          //showline: true
        },
        //title: titles[form.plotId].title,
        showlegend: true,
        legend: {
          orientation: "h",
          x: 1,
          y: 1.08,
          //valign: "top"
          xanchor: "right",
        },
        annotations: annotations,
      }}
      config={{ displaylogo: false }}
      onClick={handleClick}
    />
  );
};

export default MainPlot;
