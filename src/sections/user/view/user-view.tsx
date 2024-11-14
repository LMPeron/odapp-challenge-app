import { useRouter } from 'src/routes/hooks';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Link } from 'react-router-dom';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows } from '../utils';
import type { PatientProps } from '../user-table-row';
import PatientService from '../../../service/PatientService';

// ----------------------------------------------------------------------

export function UserView() {
  const table = useTable();

  const router = useRouter();
  const [filterName, setFilterName] = useState('');
  const [patients, setPatients] = useState<PatientProps[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<PatientProps | null>(null);
  const [isDeleteBulk, setIsDeleteBulk] = useState(false);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const patientService = new PatientService();
      const response = await patientService.getAll({
        limit: table.rowsPerPage,
        offset: table.page * table.rowsPerPage,
        sortBy: table.orderBy,
        sortOrder: table.order,
        filter: filterName,
      });
      setCount(response.count || 0);
      setPatients(response.patients || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Não foi possível buscar os pacientes. Por favor, tente novamente.	');
    } finally {
      setLoading(false);
    }
  }, [table.page, table.rowsPerPage, table.order, table.orderBy, filterName]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const notFound = patients.length === 0 && filterName !== '';

  const handleOpenDeleteModal = (patient: PatientProps) => {
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPatientToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (isDeleteBulk) {
      try {
        const patientService = new PatientService();
        await patientService.deleteBulk(table.selected);
        fetchPatients();
        table.setSelected([]);
        handleCloseDeleteModal();
      } catch (err) {
        console.error('Error deleting patients:', err);
        setError('Falha ao deletar pacientes selecionados. Por favor, tente novamente.');
        handleCloseDeleteModal();
      }
    } else if (patientToDelete) {
      try {
        const patientService = new PatientService();
        await patientService.delete(patientToDelete.id);
        fetchPatients();
        handleCloseDeleteModal();
      } catch (err) {
        console.error('Error deleting patient:', err);
        setError('Falha ao deletar paciente. Por favor, tente novamente.');
        handleCloseDeleteModal();
      }
    }
  };

  const handleDeleteSelected = () => {
    if (table.selected.length > 0) {
      setIsDeleteBulk(true);
      setIsDeleteModalOpen(true);
    }
  };

  const handleEditSelected = (patient: PatientProps) => {
    router.push(`/paciente/editar/${patient.id}`);
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Pacientes
        </Typography>
        <Button
          component={Link}
          to="/paciente/novo"
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Novo paciente
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onDeleteSelected={handleDeleteSelected}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={patients.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    patients.map((patient) => patient.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Nome', sortable: true },
                  { id: 'age', label: 'Idade', sortable: true },
                  { id: 'city', label: 'Cidade', sortable: false },
                  { id: 'state', label: 'Estado', sortable: false },
                  { id: 'actions', label: 'Ações', sortable: false },
                ]}
              />
              <TableBody>
                {loading ? (
                  <Box sx={{ p: 2 }} />
                ) : (
                  patients.map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDelete={() => handleOpenDeleteModal(row)}
                      onEdit={() => handleEditSelected(row)}
                    />
                  ))
                )}

                {!loading && (
                  <TableEmptyRows
                    emptyRows={emptyRows(table.page, table.rowsPerPage, patients.length)}
                  />
                )}

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          labelRowsPerPage="Linhas por página:"
          page={table.page}
          count={count}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogTitle id="delete-confirmation-dialog">
          {isDeleteBulk ? 'Confirmar exclusão em massa' : 'Confirmar exclusão'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {isDeleteBulk
              ? `Tem certeza que deseja excluir ${table.selected.length} pacientes selecionados?`
              : `Tem certeza que deseja excluir o paciente ${patientToDelete?.name}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Box mt={2}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      )}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState<'name' | 'age' | 'city' | 'state'>('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id as 'name' | 'age' | 'city' | 'state');
      setPage(0);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    setSelected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
