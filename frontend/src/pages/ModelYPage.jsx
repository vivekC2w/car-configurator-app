import CarConfigurator from "../components/ReusableComponents/CarConfigurator/CarConfigurator/CarConfigurator";
import App from "../App";
import { useModels } from "../context/ModelsContext";
import { Suspense } from "react";
import LoadingSpinner from "../components/ReusableComponents/LoadingSpinner/LoadingSpinner";
export default function ModelYPage() {
  const { getModelsByName } = useModels();
  const model = getModelsByName("Model Y");
  
  return (
    <App backgroundImageUrl={model?.image}>
    <Suspense fallback={<LoadingSpinner />}>
      <CarConfigurator modelName="Model Y" />
    </Suspense>
  </App>
    );
}
