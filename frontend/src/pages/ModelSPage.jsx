import { Suspense } from "react";
import CarConfigurator from "../components/ReusableComponents/CarConfigurator/CarConfigurator/CarConfigurator";
import App from "../App";
import { useModels } from "../context/ModelsContext";
import LoadingSpinner from "../components/ReusableComponents/LoadingSpinner/LoadingSpinner";

export default function ModelSPage() {
  const { getModelsByName } = useModels();
  const model = getModelsByName("Model S");
  
  return (
    <App backgroundImageUrl={model?.image}>
      <Suspense fallback={<LoadingSpinner />}>
        <CarConfigurator modelName="Model S" />
      </Suspense>
    </App>
  );
}
