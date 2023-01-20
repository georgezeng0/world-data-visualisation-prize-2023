import MainPlot from "./components/MainPlot";

function App() {
  return (
    <div className="App">
      <h1>
        Title + Logo
      </h1>
      <MainPlot />
      <iframe
        src="/plots/infant_exp.html"
        height={600}
        width={900}
      />
    </div>
  );
}

export default App;
