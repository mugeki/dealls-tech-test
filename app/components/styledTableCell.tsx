import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: 700,
    width: 300,
  },
  [`&.${tableCellClasses.body}`]: {
    width: 300,
  },
}));

export default StyledTableCell;
