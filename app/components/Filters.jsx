"use client"; // Ensure this is a Client Component

import { useState } from "react";
import { useRouter } from "next/navigation";

const Filters = ({
  brands,
  models,
  fuelTypes,
  bodyStyles,
  translations,
  mileageRange = { min: 0, max: 0 },
  powerPsRange = { min: 0, max: 0 },
  registrationRange = { min: 1900, max: 2025 },
}) => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    fuel_type: "",
    body_style: "",
    translation: "",
    mileage_min: mileageRange.min || 0,
    mileage_max: mileageRange.max || 0,
    power_ps_min: powerPsRange.min || 0,
    power_ps_max: powerPsRange.max || 0,
    date_of_registration_start: registrationRange.min || 1900,
    date_of_registration_end: registrationRange.max || 2025,
    sort: "", // Added for price sorting
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: Number(value), // Ensure the value is a number
    }));
  };

  const applyFilters = () => {
    const queryParams = new URLSearchParams();

    // Add filters to queryParams only if they have valid values
    if (filters.brand) queryParams.set("brand", filters.brand);
    if (filters.model) queryParams.set("model", filters.model);
    if (filters.fuel_type) queryParams.set("fuel_type", filters.fuel_type);
    if (filters.body_style) queryParams.set("body_style", filters.body_style);
    if (filters.translation)
      queryParams.set("translation", filters.translation);

    // Validate and add range filters
    if (
      filters.mileage_min >= mileageRange.min &&
      filters.mileage_max <= mileageRange.max
    ) {
      queryParams.set("mileage_min", filters.mileage_min);
      queryParams.set("mileage_max", filters.mileage_max);
    }
    if (
      filters.power_ps_min >= powerPsRange.min &&
      filters.power_ps_max <= powerPsRange.max
    ) {
      queryParams.set("power_ps_min", filters.power_ps_min);
      queryParams.set("power_ps_max", filters.power_ps_max);
    }
    if (
      filters.date_of_registration_start >= registrationRange.min &&
      filters.date_of_registration_end <= registrationRange.max
    ) {
      queryParams.set(
        "date_of_registration_start",
        filters.date_of_registration_start
      );
      queryParams.set(
        "date_of_registration_end",
        filters.date_of_registration_end
      );
    }

    // Add sorting filter
    if (filters.sort) queryParams.set("sort", filters.sort);

    // Navigate to the filtered URL
    router.push(`/cars?${queryParams.toString()}`);
  };

  const resetFilters = () => {
    setFilters({
      brand: "",
      model: "",
      fuel_type: "",
      body_style: "",
      translation: "",
      mileage_min: mileageRange.min,
      mileage_max: mileageRange.max,
      power_ps_min: powerPsRange.min,
      power_ps_max: powerPsRange.max,
      date_of_registration_start: registrationRange.min,
      date_of_registration_end: registrationRange.max,
      sort: "", // Reset sorting
    });
    router.push("/cars"); // Navigate to the base URL without filters
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        display:"flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ marginBottom: "20px", fontSize: "24px", color: "#333" }}>
        Filters
      </h2>

      {/* Dropdown Filters */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {/* Brand Filter */}
        <select
          name="brand"
          value={filters.brand}
          onChange={handleFilterChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value="">Select Brand</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {/* Model Filter */}
        <select
          name="model"
          value={filters.model}
          onChange={handleFilterChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value="">Select Model</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        {/* Fuel Type Filter */}
        <select
          name="fuel_type"
          value={filters.fuel_type}
          onChange={handleFilterChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value="">Select Fuel Type</option>
          {fuelTypes.map((fuelType) => (
            <option key={fuelType} value={fuelType}>
              {fuelType}
            </option>
          ))}
        </select>

        {/* Body Style Filter */}
        <select
          name="body_style"
          value={filters.body_style}
          onChange={handleFilterChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value="">Select Body Style</option>
          {bodyStyles.map((bodyStyle) => (
            <option key={bodyStyle} value={bodyStyle}>
              {bodyStyle}
            </option>
          ))}
        </select>

        {/* Translation Filter */}
        <select
          name="translation"
          value={filters.translation}
          onChange={handleFilterChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value="">Select Translation</option>
          {translations.map((translation) => (
            <option key={translation} value={translation}>
              {translation}
            </option>
          ))}
        </select>

        {/* Price Sorting Filter */}
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value="">Sort by Price</option>
          <option value="price_lowest">Price: Low to High</option>
          <option value="price_highest">Price: High to Low</option>
        </select>
      </div>

      {/* Range Filters */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "20px",
          alignItems: "flex-end"
        }}
      >
        {/* Mileage Range Filter */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "14px",
              color: "#555",
            }}
          >
            Mileage (km)
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="number"
              name="mileage_min"
              value={filters.mileage_min}
              onChange={handleRangeChange}
              placeholder="Min"
              min={mileageRange.min}
              max={mileageRange.max}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                width: "100px",
              }}
            />
            <input
              type="number"
              name="mileage_max"
              value={filters.mileage_max}
              onChange={handleRangeChange}
              placeholder="Max"
              min={mileageRange.min}
              max={mileageRange.max}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                width: "100px",
              }}
            />
          </div>
        </div>

        {/* Power PS Range Filter */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "14px",
              color: "#555",
            }}
          >
            Power (PS)
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="number"
              name="power_ps_min"
              value={filters.power_ps_min}
              onChange={handleRangeChange}
              placeholder="Min"
              min={powerPsRange.min}
              max={powerPsRange.max}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                width: "100px",
              }}
            />
            <input
              type="number"
              name="power_ps_max"
              value={filters.power_ps_max}
              onChange={handleRangeChange}
              placeholder="Max"
              min={powerPsRange.min}
              max={powerPsRange.max}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                width: "100px",
              }}
            />
          </div>
        </div>

        {/* Date of Registration Range Filter */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "14px",
              color: "#555",
            }}
          >
            Registration Year
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="number"
              name="date_of_registration_start"
              value={filters.date_of_registration_start}
              onChange={handleRangeChange}
              placeholder="Start Year"
              min={registrationRange.min}
              max={registrationRange.max}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                width: "100px",
              }}
            />
            <input
              type="number"
              name="date_of_registration_end"
              value={filters.date_of_registration_end}
              onChange={handleRangeChange}
              placeholder="End Year"
              min={registrationRange.min}
              max={registrationRange.max}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                width: "100px",
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={applyFilters}
            style={{
              padding: "8px 16px",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ccc",
              color: "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Reset Filters
          </button>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default Filters;
