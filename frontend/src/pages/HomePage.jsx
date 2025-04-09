import HomeSectionVideo from "../components/HomeSectionVideo/HomeSectionVideo";
import { useModels } from "../context/ModelsContext";

export default function HomePage() {
  const { models } = useModels();

  return (
    <>
      <HomeSectionVideo models={models}/>
    </>
  );
}
