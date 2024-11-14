import type { TableRowProps } from '@mui/material/TableRow';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type TableNoDataProps = TableRowProps & {
  searchQuery: string;
};

export function TableNoData({ searchQuery = '', ...other }: TableNoDataProps) {
  return (
    <TableRow {...other}>
      <TableCell align="center" colSpan={7}>
        <Box sx={{ py: 15, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Nenhum dado encontrado
          </Typography>

          <Typography variant="body2">
            Nenhum dado encontrado para &nbsp;
            <strong>&quot;{searchQuery}&quot;</strong>.
            <br /> Tente verificar erros de digitação ou usar palavras completas.
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}