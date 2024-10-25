import React from "react";
import CompanyTable from "./components/CompanyTable";
import "./App.css";

const App: React.FC = () => {
  return (
    <div>
      <h1>Список компаний</h1>
      <CompanyTable />
    </div>
  );
};

export default App;
