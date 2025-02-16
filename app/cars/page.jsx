"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Pagination from "@/app/components/Pagination";
import Filters from "@/app/components/Filters";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.zapsell.ch/v1/marketplace/auto_eberhart";

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
  const [registrationRange, setRegistrationRange] = useState({ min: 1900, max: 2025 });

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams?.get("page")) || 1; // Optional chaining
  const brand = searchParams?.get("brand") || "";
  const model = searchParams?.get("model") || "";
  const fuelType = searchParams?.get("fuel_type") || "";
  const bodyStyle = searchParams?.get("body_style") || "";
  const translation = searchParams?.get("translation") || "";
  const mileageMin = searchParams?.get("mileage_min") || mileageRange.min;
  const mileageMax = searchParams?.get("mileage_max") || mileageRange.max;
  const powerPsMin = searchParams?.get("power_ps_min") || powerPsRange.min;
  const powerPsMax = searchParams?.get("power_ps_max") || powerPsRange.max;
  const registrationStart = searchParams?.get("date_of_registration_start") || registrationRange.min;
  const registrationEnd = searchParams?.get("date_of_registration_end") || registrationRange.max;


  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const url = `${API_BASE_URL}/car_lists/?page=${currentPage}&brand=${brand}&model=${model}&fuel_type=${fuelType}&body_style=${bodyStyle}&translation=${translation}&mileage_min=${mileageMin}&mileage_max=${mileageMax}&power_ps_min=${powerPsMin}&power_ps_max=${powerPsMax}&date_of_registration_start=${registrationStart}&date_of_registration_end=${registrationEnd}`;
        const response = await axios.get(url);
        setCars(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Error fetching cars:", error);
        toast.error("Error fetching cars. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/car_lists/?all=true&fields=brand,model,fuel_type,body_style,translation,mileage,power_ps,year_of_registration`);
        const allCars = response.data.results;

        const uniqueValues = (field) => [...new Set(allCars.map(car => car[field]))];

        setBrands(uniqueValues("brand"));
        setModels(uniqueValues("model"));
        setFuelTypes(uniqueValues("fuel_type"));
        setBodyStyles(uniqueValues("body_style"));
        setTranslations(uniqueValues("translation"));

        const extractValues = (field) => allCars.map(car => car[field]);

        const mileageValues = extractValues("mileage");
        const powerPsValues = extractValues("power_ps");
        const registrationYears = extractValues("year_of_registration").map(dateString => new Date(dateString).getFullYear());

        setMileageRange({ min: Math.min(...mileageValues), max: Math.max(...mileageValues) });
        setPowerPsRange({ min: Math.min(...powerPsValues), max: Math.max(...powerPsValues) });
        setRegistrationRange({ min: Math.min(...registrationYears), max: Math.max(...registrationYears) });

      } catch (error) {
        console.error("Error fetching filter options:", error);
        toast.error("Error fetching filter options. Please try again later.");
      }
    };

    fetchCars();
    fetchFilterOptions();
  }, [currentPage, brand, model, fuelType, bodyStyle, translation, mileageMin, mileageMax, powerPsMin, powerPsMax, registrationStart, registrationEnd, searchParams]); // searchParams added


  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle cases where dateString is null or undefined
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}. ${year}`;
  };

  if (loading) return <div>Loading...</div>; // Improved loading state

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

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {cars.map((car) => (
          <Link key={car.car_id} href={`/cars/${car.car_id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ border: "1px solid #ccc", borderRadius: "8px", width: "400px", cursor: "pointer" }}>
              {car.car_pictures && car.car_pictures.length > 0 && ( // Conditional rendering for images
                <img src={car.car_pictures[0]} alt={`${car.brand} ${car.model}`} style={{ width: "100%", borderRadius: "8px 8px 0 0" }} />
              )}
              {/* ... (rest of the car card JSX - same as before) */}
               <div style={{ padding: "10px", textAlign: "center" }}>
                <h2 style={{ margin: "5px 0 5px", fontSize: "22px", fontWeight: "600" }}>
                  {car.brand} {car.model}
                </h2>
                <p style={{ margin: "0 0 10px", fontSize: "16px", color: "#555" }}>
                  {formatDate(car.year_of_registration)}
                </p>
                <p style={{ margin: "0 0 10px", fontSize: "18px", fontWeight: "600" }}>
                  {car.price?.toLocaleString() || "Price not available"} CHF {/* Optional chaining for price */}
                </p>
                <hr style={{ borderTop: "1px dotted #aaa", margin: "20px 0" }} />
                <div style={{ display: "flex", fontSize: "16px", color: "#555", justifyContent: "space-around", paddingBottom: "15px" }}>
                  <span>{car.mileage?.toLocaleString() || "Mileage not available"} km</span>
                  <span>{car.power_ps || "Power not available"} PS</span>
                  <span>{car.gear_type || "Gear type not available"}</span>
                  <span>{car.fuel_type || "Fuel type not available"}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/cars" />
    </div>
  );
};

export default Cars;