
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GiftProvider } from "@/contexts/GiftContext";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GiftProvider>
        <Toaster />
        <Sonner />
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
      </GiftProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
