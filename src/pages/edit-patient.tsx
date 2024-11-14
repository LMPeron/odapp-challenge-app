import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { EditPatientView } from 'src/sections/patient/view/edit-patient-view';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Editar Paciente - ${CONFIG.appName}`}</title>
      </Helmet>

      <EditPatientView />
    </>
  );
}
