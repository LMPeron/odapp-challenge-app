import type { BoxProps } from '@mui/material/Box';
import { forwardRef } from 'react';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  isSingle?: boolean;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    const theme = useTheme();

    return (
      <div style={{ textAlign: 'center' }}>
        <img
          src="/assets/logo.jpg"
          alt="Logo"
          style={{ width: '50px', height: '50px', borderRadius: '100px' }}
        />
      </div>
    );
  }
);
