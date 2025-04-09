import { Suspense } from "react";
import CarConfigurator from "../components/ReusableComponents/CarConfigurator/CarConfigurator/CarConfigurator";
import App from "../App";
import { useModels } from "../context/ModelsContext";
import LoadingSpinner from "../components/ReusableComponents/LoadingSpinner/LoadingSpinner";

export default function ModelXPage() {
  const { getModelsByName } = useModels();
  const model = getModelsByName("Model X");

  return (
    <App backgroundImageUrl={model?.image}>
      <Suspense fallback={<LoadingSpinner />}>
        <CarConfigurator modelName="Model X" />
      </Suspense>
    </App>
  );
}