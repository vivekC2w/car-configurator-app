import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAccessoriesByVariantId,
  fetchColorsByVariant,
  fetchFeaturesByVariantId,
  fetchModelByName,
  fetchVariantsByModel,
} from "../../../../services/api";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

export default function CarConfigurator({ modelName }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const {
    data: modelData,
    isLoading: modelLoading,
    error: modelError,
  } = useQuery({
    queryKey: ["model", modelName],
    queryFn: () => fetchModelByName(modelName),
    select: (response) => response.data,
  });

  const {
    data: variants,
    isLoading: variantsLoading,
    error: variantsError,
  } = useQuery({
    queryKey: ["variants", modelData?._id],
    queryFn: () => fetchVariantsByModel(modelData._id),
    select: (response) => response.data,
    enabled: !!modelData?._id,
  });

  const selectedVariant = variants?.[selectedVariantIndex];

  const { data: colorsData, isLoading: colorsLoading } = useQuery({
    queryKey: ["colors", selectedVariant?._id],
    queryFn: () => fetchColorsByVariant(selectedVariant._id),
    select: (response) => response.data,
    enabled: !!selectedVariant?._id,
  });

  const { data: accessories } = useQuery({
    queryKey: ["accessories", selectedVariant?._id],
    queryFn: () => fetchAccessoriesByVariantId(selectedVariant._id),
    enabled: !!selectedVariant?._id,
  });

  const { data: features } = useQuery({
    queryKey: ["features", selectedVariant?._id],
    queryFn: () => fetchFeaturesByVariantId(selectedVariant._id),
    enabled: !!selectedVariant?._id,
  });

  const variantOptions = useMemo(
    () =>
      variants?.map((variant) => ({
        id: variant._id,
        name: variant.name,
        price: variant.price,
      })) || [],
    [variants]
  );

  if (modelLoading || variantsLoading) return <LoadingSpinner />;
  if (modelError || variantsError)
    return (
      <div style={{ color: "red", padding: "2rem" }}>
        Error: {modelError?.message || variantsError?.message}
      </div>
    );
  if (!variants || !variants.length)
    return (
      <div style={{ color: "#fff", padding: "2rem" }}>No variants found</div>
    );

  return (
    <div
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 1,
        }}
      />

      {/* Content container with scroll */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100vh",
          overflowY: "auto",
          padding: "40px",
          paddingBottom: "80px",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "1.5rem",
            textAlign: "center",
            position: "sticky",
            top: 0,
            // backgroundColor: "rgba(0,0,0,0.7)",
            padding: "20px",
            zIndex: 3,
            backdropFilter: "blur(5px)",
          }}
        >
          {modelName} Configurator
        </h1>

        {/* Variant selection */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Select Variant:
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {variantOptions.map((v, index) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantIndex(index)}
                style={{
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor:
                    index === selectedVariantIndex ? "#4CAF50" : "#333",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  ":hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>

        {/* Colors section */}
        <section style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "20px" }}>Colors:</h3>
          {colorsLoading ? (
            <div style={{ color: "#fff" }}>Loading colors...</div>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "center",
              }}
            >
              {colorsData?.map((color) => (
                <div
                  key={color._id}
                  style={{
                    textAlign: "center",
                    minWidth: "80px",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    ":hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: color.hexCode,
                      borderRadius: "50%",
                      border: "2px solid #fff",
                      margin: "0 auto 8px",
                    }}
                  />
                  <div>{color.name}</div>
                  <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
                    ₹{color.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Accessories section */}
        <section style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "20px" }}>
            Accessories:
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {accessories?.data?.map((accessory) => (
              <div
                key={accessory._id}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "center",
                  transition: "all 0.3s",
                  ":hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                <img
                  src={accessory.image}
                  alt={accessory.name}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    marginBottom: "10px",
                  }}
                />
                <h4 style={{ margin: "8px 0", color: "#fff" }}>
                  {accessory.name}
                </h4>
                <p
                  style={{
                    color: "#4CAF50",
                    fontWeight: "bold",
                    margin: "5px 0",
                  }}
                >
                  ₹{accessory.price.toLocaleString()}
                </p>
                <p
                  style={{
                    color: "#aaa",
                    fontSize: "0.9rem",
                    margin: "5px 0",
                  }}
                >
                  {accessory.category}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features section */}
        <section style={{ marginBottom: "80px" }}>
          <h3
            style={{
              fontSize: "1.3rem",
              marginBottom: "20px",
              position: "sticky",
              top: "80px",
              // backgroundColor: "rgba(0,0,0,0.7)",
              padding: "10px",
              zIndex: 2,
              backdropFilter: "blur(5px)",
            }}
          >
            Features:
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "30px",
            }}
          >
            {features?.data?.map((feat) => (
              <div
                key={feat._id}
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  padding: "15px",
                  transition: "all 0.3s",
                  ":hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <img
                    src={feat.image}
                    alt={feat.name}
                    style={{
                      width: "100%",
                      height: "140px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                  <h4 style={{ margin: "10px 0", fontSize: "1.1rem" }}>
                    {feat.name}
                  </h4>
                </div>
                <div
                  style={{
                    marginTop: "15px",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <video
                    width="100%"
                    controls
                    style={{
                      display: "block",
                      borderRadius: "8px",
                    }}
                  >
                    <source src={feat.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
