import React from "react";
import countries from "../data/countries";

const PlotForm = ({ props: { setForm, form } }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setForm({ ...form, [name]: value });
  };

  const handleClick = () => {
    setForm({ ...form, country: "all" });
  };

  return (
    <form onSubmit={handleSubmit} className="plot-form">
      <div className="form-item">
        <label htmlFor="plot_id">Metric</label>
        <select onChange={handleChange} name="plotId" id="plot_id">
          <option value="inf_vs_exp">Infant Mortality</option>
          <option value="mat_vs_exp">Maternal Mortality</option>
          <option value="life_vs_exp">Life Expectancy</option>
        </select>
      </div>
      <div className="form-item">
        <label htmlFor="country">Country</label>
        <select
          onChange={handleChange}
          name="country"
          id="country"
          value={form.country}
        >
          <option value="all">All Countries</option>
          {countries.map((country, i) => (
            <option key={i} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      <div className="form-item">
        <button type="button" onClick={handleClick}
        disabled={form.country==="all"}>
          All Countries
        </button>
      </div>
    </form>
  );
};

export default PlotForm;
