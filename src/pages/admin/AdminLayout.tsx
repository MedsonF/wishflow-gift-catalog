import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useGiftContext } from '@/contexts/GiftContext';

const AdminLayout = () => {
  const { currentUser } = useGiftContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <AdminHeader />
      </div>
      <div className="flex flex-1 pt-[64px]">
        <div className="w-64 fixed top-[64px] bottom-0 hidden md:block">
          <AdminSidebar />
        </div>
        <main className="flex-1 p-6 bg-gray-50 overflow-auto md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
