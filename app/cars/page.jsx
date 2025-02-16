"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Pagination from "@/app/components/Pagination";
import Filters from "@/app/components/Filters";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [bodyStyles, setBodyStyles] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [mileageRange, setMileageRange] = useState({ min: 0, max: 0 });
  const [powerPsRange, setPowerPsRange] = useState({ min: 0, max: 0 });
  const [registrationRange, setRegistrationRange] = useState({
    min: 1900,
    max: 2025,
  });

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const brand = searchParams.get("brand") || "";
  const model = searchParams.get("model") || "";
  const fuelType = searchParams.get("fuel_type") || "";
  const bodyStyle = searchParams.get("body_style") || "";
  const translation = searchParams.get("translation") || "";
  const mileageMin = searchParams.get("mileage_min") || mileageRange.min;
  const mileageMax = searchParams.get("mileage_max") || mileageRange.max;
  const powerPsMin = searchParams.get("power_ps_min") || powerPsRange.min;
  const powerPsMax = searchParams.get("power_ps_max") || powerPsRange.max;
  const registrationStart =
    searchParams.get("date_of_registration_start") || registrationRange.min;
  const registrationEnd =
    searchParams.get("date_of_registration_end") || registrationRange.max;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const url = `https://api.zapsell.ch/v1/marketplace/auto_eberhart/car_lists/?page=${currentPage}&brand=${brand}&model=${model}&fuel_type=${fuelType}&body_style=${bodyStyle}&translation=${translation}&mileage_min=${mileageMin}&mileage_max=${mileageMax}&power_ps_min=${powerPsMin}&power_ps_max=${powerPsMax}&date_of_registration_start=${registrationStart}&date_of_registration_end=${registrationEnd}`;
        console.log("Fetching cars from:", url); // Debugging: Log the URL
        const response = await axios.get(url);
        setCars(response.data.results);
        setTotalPages(response.data.total_pages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    };

    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(
          "https://api.zapsell.ch/v1/marketplace/auto_eberhart/car_lists/?all=true"
        );
        const allCars = response.data.results;

        // Extract unique values for filters
        const uniqueBrands = [...new Set(allCars.map((car) => car.brand))];
        const uniqueModels = [...new Set(allCars.map((car) => car.model))];
        const uniqueFuelTypes = [
          ...new Set(allCars.map((car) => car.fuel_type)),
        ];
        const uniqueBodyStyles = [
          ...new Set(allCars.map((car) => car.body_style)),
        ];
        const uniqueTranslations = [
          ...new Set(allCars.map((car) => car.translation)),
        ];

        // Extract range values
        const mileageValues = allCars.map((car) => car.mileage);
        const powerPsValues = allCars.map((car) => car.power_ps);
        const registrationYears = allCars.map((car) =>
          new Date(car.year_of_registration).getFullYear()
        );

        setBrands(uniqueBrands);
        setModels(uniqueModels);
        setFuelTypes(uniqueFuelTypes);
        setBodyStyles(uniqueBodyStyles);
        setTranslations(uniqueTranslations);
        setMileageRange({
          min: Math.min(...mileageValues),
          max: Math.max(...mileageValues),
        });
        setPowerPsRange({
          min: Math.min(...powerPsValues),
          max: Math.max(...powerPsValues),
        });
        setRegistrationRange({
          min: Math.min(...registrationYears),
          max: Math.max(...registrationYears),
        });
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchCars();
    fetchFilterOptions();
  }, [
    currentPage,
    brand,
    model,
    fuelType,
    bodyStyle,
    translation,
    mileageMin,
    mileageMax,
    powerPsMin,
    powerPsMax,
    registrationStart,
    registrationEnd,
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits for month
    const year = date.getFullYear();
    return `${month}. ${year}`; // Format as "01. 1995"
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <Filters
        brands={brands}
        models={models}
        fuelTypes={fuelTypes}
        bodyStyles={bodyStyles}
        translations={translations}
        mileageRange={mileageRange}
        powerPsRange={powerPsRange}
        registrationRange={registrationRange}
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {cars.map((car) => (
          <Link
            key={car.car_id}
            href={`/cars/${car.car_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                width: "400px",
                cursor: "pointer",
              }}
            >
              <img
                src={car.car_pictures[0]}
                alt={`${car.brand} ${car.model}`}
                style={{ width: "100%", borderRadius: "8px 8px 0 0" }}
              />
              <div style={{ padding: "10px", textAlign: "center" }}>
                <h2
                  style={{
                    margin: "5px 0 5px",
                    fontSize: "22px",
                    fontWeight: "600",
                  }}
                >
                  {car.brand} {car.model}
                </h2>
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: "16px",
                    color: "#555",
                  }}
                >
                  {formatDate(car.year_of_registration)}
                </p>
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                >
                  {car.price.toLocaleString()} CHF
                </p>
                <hr
                  style={{ borderTop: "1px dotted #aaa", margin: "20px 0" }}
                />
                <div
                  style={{
                    display: "flex",
                    fontSize: "16px",
                    color: "#555",
                    justifyContent: "space-around",
                    paddingBottom: "15px",
                  }}
                >
                  <span>{car.mileage.toLocaleString()} km</span>
                  <span>{car.power_ps} PS</span>
                  <span>{car.gear_type}</span>
                  <span>{car.fuel_type}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/cars"
      />
    </div>
  );
};

export default Cars;