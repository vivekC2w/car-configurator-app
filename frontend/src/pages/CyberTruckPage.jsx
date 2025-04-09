import CarConfigurator from "../components/ReusableComponents/CarConfigurator/CarConfigurator/CarConfigurator";
import { useModels } from "../context/ModelsContext";
import App from "../App";
import { Suspense } from "react";
import LoadingSpinner from "../components/ReusableComponents/LoadingSpinner/LoadingSpinner";

export default function CyberTruckPage() {
  const { getModelsByName } = useModels();
  const model = getModelsByName("CyberTruck");

  return (
    <App backgroundImageUrl={model?.image}>
      <Suspense fallback={<LoadingSpinner />}>
        <CarConfigurator modelName="CyberTruck" />
      </Suspense>
    </App>
  );
}