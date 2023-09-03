import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type Props = {
  ariaLabel?: string;
  tRows: JSX.Element | JSX.Element[];
  tHeads: JSX.Element;
  isLoading?: boolean;
  isEmpty?: boolean;
};
export default function TableTemplate({
  ariaLabel,
  tRows,
  tHeads,
  isLoading,
  isEmpty,
}: Props) {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: "65vh" }}>
      <Table sx={{ minWidth: 200 }} aria-label={ariaLabel} stickyHeader>
        <TableHead>
          <TableRow>{tHeads}</TableRow>
        </TableHead>
        <TableBody>{!isLoading && tRows}</TableBody>
      </Table>
      {(() => {
        if (isLoading)
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <CircularProgress sx={{ margin: "5rem auto" }} />
            </Box>
          );

        if (isEmpty)
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  margin: "2rem auto",
                  fontStyle: "italic",
                  color: "gray",
                }}
              >
                Nothing found...
              </span>
            </Box>
          );

        return null;
      })()}
    </TableContainer>
  );
}
