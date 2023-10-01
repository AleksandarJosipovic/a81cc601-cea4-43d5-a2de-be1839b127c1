import React from "react";
import "./App.css";
import TilgunsPlan from "./pages/TilgungsPlanView";

function App() {
  return (
    <div className="App">
      <header className="">
        <h1>Tilgungsrechner</h1>
      </header>
      <main>
        <TilgunsPlan />
      </main>
    </div>
  );
}

export default App;
