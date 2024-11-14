import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { useAuth } from 'src/contexts/AuthContext';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Loading state for the sign-in button
  const [isLoading, setIsLoading] = useState(false);

  // Error state
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrors({ email: '', password: '', general: '' });
      let hasError = false;
      const newErrors = { email: '', password: '', general: '' };
      if (!email) {
        newErrors.email = 'Email é obrigatório.';
        hasError = true;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email inválido.';
        hasError = true;
      }
      if (!password) {
        newErrors.password = 'Senha é obrigatória.';
        hasError = true;
      }
      if (hasError) {
        setErrors(newErrors);
        return;
      }
      setIsLoading(true);
      try {
        await signIn({ email, password });
        router.push('/paciente');
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          general: 'Falha ao entrar. Por favor, tente novamente.',
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, signIn, router]
  );

  const renderForm = (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
    >
      <TextField
        fullWidth
        name="email"
        label="Email"
        placeholder="Digite seu email"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={Boolean(errors.email)}
        helperText={errors.email}
      />

      <TextField
        fullWidth
        name="password"
        label="Senha"
        placeholder="Digite sua senha"
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={Boolean(errors.password)}
        helperText={errors.password}
      />

      {errors.general && (
        <Typography variant="body2" color="error" sx={{ mb: 2, width: '100%', textAlign: 'right' }}>
          {errors.general}
        </Typography>
      )}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        loading={isLoading}
      >
        Entrar
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Entrar</Typography>
        <Typography variant="body2" color="text.secondary">
          Administração ODapp
        </Typography>
      </Box>

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OU
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit" aria-label="Entrar com Google">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit" aria-label="Entrar com GitHub">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit" aria-label="Entrar com Twitter">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box>
    </>
  );
}
