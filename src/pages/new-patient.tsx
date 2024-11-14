import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { RegisterPatientView } from 'src/sections/patient/view/register-patient-view';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Novo Paciente - ${CONFIG.appName}`}</title>
      </Helmet>

      <RegisterPatientView />
    </>
  );
}
