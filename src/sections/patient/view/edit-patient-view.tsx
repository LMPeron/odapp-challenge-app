import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import LocationService from 'src/service/LocationService';
import PatientService from 'src/service/PatientService';
import Card from '@mui/material/Card';
import { useRouter } from 'src/routes/hooks';
import { DashboardContent } from 'src/layouts/dashboard/main';
// ----------------------------------------------------------------------

export function EditPatientView() {
  const { id } = useParams<{ id: string }>();
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const fetchStates = useCallback(async () => {
    try {
      const locationService = new LocationService();
      const response = await locationService.getStates();
      const list = response.data || [];
      setStates(list);
    } catch (err) {
      console.error('Error fetching states:', err);
    }
  }, []);

  const fetchCities = useCallback(async (stateId: string) => {
    try {
      const locationService = new LocationService();
      const response = await locationService.getCities(stateId);
      const list = response.data || [];
      setCities(list);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  }, []);

  const handleChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
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
        fetchCities(value as string);
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
    else if (Number(formData.age) > 120) newErrors.age = 'Idade não pode ser maior que 120';
    if (!formData.state) newErrors.state = 'Estado é obrigatório';
    if (!formData.city) newErrors.city = 'Cidade é obrigatória';
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
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

  const handleUpdate = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (validateForm()) {
        setLoading(true);
        try {
          const patientService = new PatientService();
          await patientService.update(id, {
            ...formData,
            age: Number(formData.age),
          });
          router.push('/paciente');
        } catch (err) {
          console.error('Error updating patient:', err);
        } finally {
          setLoading(false);
        }
      }
    },
    [id, formData, validateForm, router]
  );

  useEffect(() => {
    const initialize = async () => {
      await fetchStates();
      if (id) {
        try {
          const patientService = new PatientService();
          const response = await patientService.getById(id);
          const patient = response.patient;
          if (patient) {
            await fetchCities(patient.Location?.State?.id);
            setFormData({
              name: patient.name || '',
              age: patient.age?.toString() || '',
              state: patient.Location?.State?.id || '',
              city: patient.Location?.City?.id || '',
            });
          } else {
            console.error('Patient not found');
          }
        } catch (err) {
          console.error('Error fetching patient data:', err);
        } finally {
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
      }
    };
    initialize();
  }, [id, fetchStates, fetchCities]);

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DashboardContent>
      <Card sx={{ p: 3 }}>
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
          <Typography variant="h5">Editar paciente</Typography>
          <Typography variant="body2" color="text.secondary">
            Edite os detalhes do paciente ou
            <Link
              variant="subtitle2"
              sx={{ ml: 0.5, cursor: 'pointer' }}
              onClick={() => router.push('/paciente')}
            >
              volte para a lista
            </Link>
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleUpdate}
          noValidate
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
        >
          <TextField
            fullWidth
            name="name"
            label="Nome Completo"
            placeholder="Digite o nome completo"
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
            placeholder="Digite a idade"
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
              {cities.map((option: any) => (
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
            loading={loading}
            disabled={!isValid || loading}
          >
            Atualizar
          </LoadingButton>
        </Box>
      </Card>
    </DashboardContent>
  );
}
