
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GiftProvider } from "@/contexts/GiftContext";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import GalleryPage from "./pages/GalleryPage";
import LoginPage from "./pages/LoginPage";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageItems from "./pages/admin/ManageItems";
import NewItem from "./pages/admin/NewItem";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageGallery from "./pages/admin/ManageGallery";
import SiteSettings from "./pages/admin/SiteSettings";

// Configure QueryClient with proper error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      onError: (error) => {
        console.error("Query error:", error);
      }
    },
  },
});

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize app and load initial data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GiftProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="items" element={<ManageItems />} />
                <Route path="items/new" element={<NewItem />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="gallery" element={<ManageGallery />} />
                <Route path="settings" element={<SiteSettings />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </GiftProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
