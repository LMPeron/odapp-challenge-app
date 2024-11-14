import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ProtectedRoute } from 'src/components/ProtectedRoute';

export const PatientsPage = lazy(() => import('src/pages/patients'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const NewPatient = lazy(() => import('src/pages/new-patient'));
export const EditPatient = lazy(() => import('src/pages/edit-patient'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { element: <PatientsPage />, index: true },
        { path: 'paciente', element: <PatientsPage /> },
        { path: 'paciente/novo', element: <NewPatient /> },
        { path: 'paciente/editar/:id', element: <EditPatient /> },
      ],
    },
    {
      path: 'entrar',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
