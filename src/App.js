import React, { useState, useEffect } from "react";
import "./App.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import dummyData from "./dummyData.json";

const App = () => {
  const [data, setData] = useState(dummyData);
  const [filteredData, setFilteredData] = useState(data);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [plant, setPlant] = useState(null);
  const csvSeparator = ",";
  const plants = ["BK1", "BK2", "BK3"];

  const resetFilters = () => {
    setGlobalFilter(null);
    setDateRange(null);
    setPlant(null);
  };

  const header = (
    <div className="table-header">
      <h1 className="p-m-0">Readings</h1>
      <span className="p-input-icon-left" style={{ marginRight: "20px" }}>
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Filter Search"
        />
      </span>
      <span className="p-input-icon-left" style={{ marginRight: "20px" }}>
        <Dropdown
          value={plant}
          options={plants}
          onChange={(e) => setPlant(e.value)}
          placeholder="Filter by Plant"
        />
      </span>
      <span className="p-input-icon-left" style={{ marginRight: "20px" }}>
        <Calendar
          value={dateRange}
          onChange={(e) => setDateRange(e.value)}
          selectionMode="range"
          readOnlyInput
          placeholder="Filter by Date Range"
        />
      </span>
      <Button label="Reset Filters" onClick={resetFilters} />
    </div>
  );

  useEffect(() => {
    let filtered = data;

    // Apply global filter
    if (globalFilter) {
      const filterValue = globalFilter.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(filterValue)
        )
      );
    }

    // Apply plant filter
    if (plant) {
      filtered = filtered.filter((item) => item.Plant === plant);
    }

    // Apply date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange;
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.Timestamp);
        return itemDate >= start && itemDate <= end;
      });
    }

    setFilteredData(filtered);
  }, [data, globalFilter, dateRange, plant]);

  const exportCSV = () => {
    const columns = [
      "Reading ID",
      "Device ID",
      "Timestamp",
      "Power",
      "Power Unit",
      "Voltage",
      "Voltage Unit",
      "Current",
      "Current Unit",
      "Power Factor",
      "Frequency",
      "Plant",
    ];
    let csvContent =
      "data:text/csv;charset=utf-8," + columns.join(csvSeparator) + "\r\n";

    filteredData.forEach((item) => {
      let row = [];
      columns.forEach((col, i) => {
        if (i === 0) {
          row.push(item.Reading_ID);
        } else {
          row.push(item[col.replace(" ", "_")]);
        }
      });
      csvContent += row.join(csvSeparator) + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "readings.csv");
    document.body.appendChild(link);

    link.click();
  };

  return (
    <div className="App">
      <DataTable
        value={filteredData}
        paginator
        rows={10}
        header={header}
        globalFilter={globalFilter}
      >
        <Column field="Reading_ID" header="Reading ID" />
        <Column field="Device_ID" header="Device ID" />
        <Column field="Timestamp" header="Timestamp" />
        <Column field="Power" header="Power" />
        <Column field="Power_Unit" header="Power Unit" />
        <Column field="Voltage" header="Voltage" />
        <Column field="Voltage_Unit" header="Voltage Unit" />
        <Column field="Current" header="Current" />
        <Column field="Current_Unit" header="Current Unit" />
        <Column field="Power_Factor" header="Power Factor" />
        <Column field="Frequency" header="Frequency" />
        <Column field="Plant" header="Plant" />
      </DataTable>
      <Button
        label="Generate CSV Report"
        className="p-mt-3 "
        onClick={exportCSV}
      />
    </div>
  );
};

export default App;
