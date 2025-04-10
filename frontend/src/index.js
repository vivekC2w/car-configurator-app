import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { ModelsProvider } from "./context/ModelsContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchProvider } from "./context/SearchContext";
import SearchResults from "./pages/SearchResults";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const ModelSPage = React.lazy(() => import("./pages/ModelSPage"));
const ModelXPage = React.lazy(() => import("./pages/ModelXPage"));
const CyberTruckPage = React.lazy(() => import("./pages/CyberTruckPage"));
const ModelYPage = React.lazy(() => import("./pages/ModelYPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes cache
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App>
        <React.Suspense fallback={<div>Loading...</div>}>
          <HomePage />
        </React.Suspense>
      </App>
    ),
  },
  {
    path: "/modelS",
    element: (
      <App>
        <React.Suspense fallback={<div>Loading...</div>}>
          <ModelSPage />
        </React.Suspense>
      </App>
    ),
  },
  {
    path: "/modelX",
    element: (
      <App>
        <React.Suspense fallback={<div>Loading...</div>}>
          <ModelXPage />
        </React.Suspense>
      </App>
    ),
  },
  {
    path: "/modelY",
    element: (
      <App>
        <React.Suspense fallback={<div>Loading...</div>}>
          <ModelYPage />
        </React.Suspense>
      </App>
    ),
  },
  {
    path: "/cybertruck",
    element: (
      <App>
        <React.Suspense fallback={<div>Loading...</div>}>
          <CyberTruckPage />
        </React.Suspense>
      </App>
    ),
  },
  {
    path: "/search",
    element: (
      <App>
        <React.Suspense fallback={<div>Loading...</div>}>
          <SearchResults />
        </React.Suspense>
      </App>
    ),
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ModelsProvider>
        <SearchProvider>
          <RouterProvider router={router} />
        </SearchProvider>
      </ModelsProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
