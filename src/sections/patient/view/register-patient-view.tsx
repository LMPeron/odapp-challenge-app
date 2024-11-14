import { useState, useCallback, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { useRouter } from 'src/routes/hooks';
import LocationService from 'src/service/LocationService';
import PatientService from 'src/service/PatientService';

// ----------------------------------------------------------------------

export function RegisterPatientView() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    state: '',
    city: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    age: '',
    state: '',
    city: '',
  });

  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const fetchStates = async () => {
    try {
      const locationService = new LocationService();
      const response = await locationService.getStates();
      const list = response.data || [];
      setStates(list);
    } catch (err) {
      console.error('Error fetching states:', err);
    }
  };

  const fetchCities = async (stateId: string) => {
    try {
      const locationService = new LocationService();
      const response = await locationService.getCities(stateId);
      const list = response.data || [];
      setCities(list);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  const handleChange = (field: string) => (event: any) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'state') {
      setFormData((prev) => ({
        ...prev,
        city: '',
      }));
      setErrors((prev) => ({
        ...prev,
        city: '',
      }));
      fetchCities(value);
    }
  };

  const validateForm = useCallback(() => {
    const newErrors = {
      name: '',
      age: '',
      state: '',
      city: '',
    };
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    else if (!/^[A-Za-z\s]+$/.test(formData.name))
      newErrors.name = 'Nome pode conter apenas letras e espaços';
    if (!formData.age) newErrors.age = 'Idade é obrigatória';
    else if (!Number.isInteger(Number(formData.age)) || Number(formData.age) <= 0)
      newErrors.age = 'Idade deve ser um número inteiro positivo';
    else if (Number(formData.age) > 120) newErrors.age = 'Idade máxima é 120 anos';
    if (!formData.state) newErrors.state = 'Estado é obrigatório';
    if (!formData.city) newErrors.city = 'Cidade é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const isValid = useMemo(() => {
    validateForm();
    return (
      formData.name.trim() !== '' &&
      /^[A-Za-z\s]+$/.test(formData.name) &&
      formData.age &&
      Number.isInteger(Number(formData.age)) &&
      Number(formData.age) > 0 &&
      formData.state !== '' &&
      formData.city !== ''
    );
  }, [formData, validateForm]);

  const handleRegister = useCallback(
    (event: any) => {
      event.preventDefault();
      if (isValid) {
        setLoading(true);
        const patientService = new PatientService();
        patientService.create({ ...formData, age: Number(formData.age) }).then(() => {
          setLoading(false);
          router.push('/paciente');
        });
      }
    },
    [router, formData, isValid]
  );

  useEffect(() => {
    fetchStates();
  }, []);

  const renderForm = (
    <Box
      component="form"
      onSubmit={handleRegister}
      noValidate
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
    >
      <TextField
        fullWidth
        name="name"
        label="Nome Completo"
        placeholder="Digite seu nome completo"
        required
        value={formData.name}
        onChange={handleChange('name')}
        error={Boolean(errors.name)}
        helperText={errors.name}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="age"
        label="Idade"
        type="number"
        placeholder="Digite sua idade"
        required
        value={formData.age}
        onChange={handleChange('age')}
        error={Boolean(errors.age)}
        helperText={errors.age}
        inputProps={{ min: 0, step: 1 }}
        sx={{ mb: 3 }}
      />

      <TextField
        select
        fullWidth
        name="state"
        label="Estado"
        value={formData.state}
        onChange={handleChange('state')}
        required
        error={Boolean(errors.state)}
        helperText={errors.state}
        sx={{ mb: 3 }}
      >
        {states.map((option: any) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>

      {formData.state && (
        <TextField
          select
          fullWidth
          name="city"
          label="Cidade"
          onChange={handleChange('city')}
          required
          value={formData.city}
          disabled={!formData.state}
          error={Boolean(errors.city)}
          helperText={errors.city}
          sx={{ mb: 3 }}
        >
          {formData.state &&
            cities.map((option: any) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
        </TextField>
      )}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        onClick={handleRegister}
        loading={loading}
        disabled={!isValid || loading}
      >
        Cadastrar
      </LoadingButton>
    </Box>
  );

  return (
    <DashboardContent>
      <Card sx={{ p: 3 }}>
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
          <Typography variant="h5">Cadastrar paciente</Typography>
          <Typography variant="body2" color="text.secondary">
            Cadastre um paciente ou
            <Link
              variant="subtitle2"
              sx={{ ml: 0.5, cursor: 'pointer' }}
              onClick={() => router.push('/paciente')}
            >
              volte para a lista
            </Link>
          </Typography>
        </Box>

        {renderForm}
      </Card>
    </DashboardContent>
  );
}
