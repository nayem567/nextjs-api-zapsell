"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const CarDetails = () => {
  const params = useParams();
  const { id } = params;
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      try {
        const response = await axios.get(
          `https://api.zapsell.ch/v1/marketplace/auto_eberhart/car_lists/?car_id=${id}`
        );
        if (response.data.results && response.data.results.length > 0) {
          setCar(response.data.results[0]);
        } else {
          console.error("No car found with the given ID");
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  // Loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // If no car is found
  if (!car) {
    return <p>Car not found</p>;
  }

  // Helper functions
  const formatEngineSize = (size) =>
    size ? `${(size / 1000).toFixed(1)}L` : "N/A";
  const formatWeight = (weight) => (weight !== "0" ? `${weight} kg` : "N/A");
  const formatEmission = (co2) => (co2 ? `${co2} g/km` : "N/A");

  // Image gallery handlers
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? car.car_pictures.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === car.car_pictures.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openLightbox = (image) => {
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>

      {/* Car Main Image */}
      <div>
        <img
          src={car.car_pictures[0]}
          alt={`${car.brand} ${car.model}`}
          style={{
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            borderRadius: "8px",
            aspectRatio: "16/9",
            objectFit: "cover",
          }}
          onClick={() => openLightbox(car.car_pictures[0])}
        />
      </div>

      {/* Car Gallery */}
      <div style={{ position: "relative", overflow: "hidden", width: "100%" }}>
        <button
          onClick={handlePrev}
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div
          style={{
            display: "flex",
            transition: "transform 0.5s ease-in-out",
            transform: `translateX(-${currentIndex * (100 / 3)}%)`,
          }}
        >
          {car.car_pictures.slice(1).map((url, index) => (
            <div
              key={index}
              style={{
                flex: "0 0 33.33%",
                boxSizing: "border-box",
                padding: "5px",
              }}
            >
              <img
                src={url}
                alt={`${car.brand} ${car.model}`}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => openLightbox(url)}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleNext}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Name - Price Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "40px",
        }}
      >
        {/* Car Brand - Model */}
        <div
          style={{
            padding: "20px 0",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "2.4rem", margin: 0, fontWeight: "bold" }}>
            {car.brand} {car.model}
          </h2>
        </div>

        {/* Car Price */}
        <div
          style={{
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "2rem", margin: 0 }}>
            {car.price.toLocaleString()} CHF
          </h2>
        </div>
      </div>

      {/* Vehicle Description */}
      {car.car_description && car.car_description !== "None" && (
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
            Vehicle Description
          </h2>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "25px",
              borderRadius: "8px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
            }}
          >
            {car.car_description}
          </div>
        </section>
      )}

      {/* Technical Specifications */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
          Technical Specifications
        </h2>
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "8px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "15px",
          }}
        >
          <SpecItem label="Body Style" value={car.body_style} />
          <SpecItem label="Gear Type" value={car.gear_type} />
          <SpecItem label="Fuel Type" value={car.fuel_type} />
          <SpecItem label="Engine" value={formatEngineSize(car.engine_size)} />
          <SpecItem label="Sitting Capacity" value={car.seating_capacity} />
          <SpecItem label="Number of Doors" value={car.number_of_doors} />
          <SpecItem label="Interior Color" value={car.color_interior} />
          <SpecItem label="Interior Type" value={car.interior_type} />
          <SpecItem label="Cylinders" value={car.cylinder} />
          <SpecItem label="Power (PS)" value={car.power_ps} />
          <SpecItem label="Power (kW)" value={car.power_kw} />
          <SpecItem
            label="CO2 Emission"
            value={formatEmission(car.co2_emission)}
          />
          <SpecItem label="Translation" value={car.translation} />
          <SpecItem label="Weight" value={formatWeight(car.weight)} />
          <SpecItem
            label="Energy Efficiency"
            value={car.energy_class !== "nan" ? car.energy_class : "N/A"}
          />
          <SpecItem
            label="Year of Construction"
            value={new Date(car.year_of_construction).getFullYear()}
          />
          <SpecItem label="Mileage" value={`${car.mileage.toLocaleString()} km`} />
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>Features</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* Standard Features */}
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "25px",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
              Standard Features
            </h3>
            <FeatureList features={car.features_standard} />
          </div>

          {/* Special Features */}
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "25px",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
              Special Features
            </h3>
            <FeatureList features={car.features_extra} />
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={lightboxImage}
              alt={`${car.brand} ${car.model}`}
              style={{
                maxWidth: "100%",
                maxHeight: "90vh", // Ensure the image fits within the viewport height
                objectFit: "contain", // Ensure the image scales properly
                borderRadius: "8px",
              }}
            />
            <button
              onClick={closeLightbox}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "white",
                border: "none",
                borderRadius: "50%",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper components
const SpecItem = ({ label, value }) => (
  <div style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
    <strong style={{ display: "block", color: "#666" }}>{label}:</strong>
    <span style={{ display: "block" }}>{value || "N/A"}</span>
  </div>
);

const FeatureList = ({ features }) => {
  if (features === "None" || !features) return <p>N/A</p>;

  // If features come as comma-separated string
  const featureArray = features.split(",").map((f) => f.trim());

  return (
    <ul style={{ listStyle: "none", paddingLeft: "0" }}>
      {featureArray.map((feature, index) => (
        <li key={index} style={{ padding: "5px 0" }}>
          • {feature}
        </li>
      ))}
    </ul>
  );
};

export default CarDetails;