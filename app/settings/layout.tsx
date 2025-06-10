'use client'

import React, { useEffect } from 'react';
import { MainAppLayout } from '@/modules/main-app/layout/MainAppLayout';
import { MapLayout } from '@/modules/map/layout/MapLayout';
import { MainAppResizableLayout } from '@/modules/main-app/layout/MainAppResizableLayout';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { SettingsLayout } from '@/modules/settings/layout/SettingsLayout';


const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const setSession = useAuthStore((state) => state.setSession); // Zustand setter

  useEffect(() => {
    if (session) {
      setSession(session); // Update Zustand store
    } else {
      setSession(null);
    }
  }, [session, setSession]);

  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in'); // Redirect if unauthenticated
    }
  }, [status, router]);

  if (status === 'loading') {
    return null; // Render nothing while loading
  }

  return <>{children}</>;
};

const Layout: React.FC<{ children?: React.ReactNode }> = (props) => {
   const { data: session, status } = useSession();
  
    return (
      <MainAppLayout session={session}>
        {session && <SettingsLayout session={session}>{props.children}</SettingsLayout>}
      </MainAppLayout>
    );
};

const AppLayout: React.FC<{ children?: React.ReactNode }> = (props) => {
  return (
    <AuthWrapper>
      <Layout>{props.children}</Layout>
    </AuthWrapper>
  );
};

export default AppLayout;
