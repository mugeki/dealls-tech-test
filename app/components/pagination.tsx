import { Box, Button } from "@mui/material";

type Props = {
  onChange:
    | React.Dispatch<React.SetStateAction<number>>
    | ((newPage: number) => void);
  page: number;
  totalPage: number;
  disablePrev?: boolean;
  disableNext?: boolean;
};
export default function Pagination({
  onChange,
  page,
  totalPage,
  disablePrev,
  disableNext,
}: Props) {
  const incPage = () => {
    onChange(page + 1);
  };

  const decPage = () => {
    onChange(page - 1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        alignSelf: "end",
      }}
    >
      <Button
        size="small"
        variant="contained"
        onClick={() => decPage()}
        disabled={page === 1 || disablePrev}
      >
        Prev
      </Button>
      <span>
        Page {page}/{totalPage || 1}
      </span>
      <Button
        size="small"
        variant="contained"
        onClick={() => incPage()}
        disabled={page === (totalPage || 1) || disableNext}
      >
        Next
      </Button>
    </Box>
  );
}
