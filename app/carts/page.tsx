"use client";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import Link from "next/link";
import * as React from "react";
import Pagination from "../components/pagination";
import StyledTableCell from "../components/styledTableCell";
import TableTemplate from "../components/tableTemplate";

export default function Carts() {
  const pageSize = 10;
  const [page, setPage] = React.useState<number>(1);
  const [data, setData] = React.useState({
    totalPage: 0,
    carts: [],
  });

  const [isLoading, setLoading] = React.useState(true);

  // Fetch Carts
  React.useEffect(() => {
    setLoading(true);
    axios
      .get("/api/carts", {
        params: {
          size: pageSize,
          page: page,
        },
      })
      .then((res) => {
        const data = res.data;
        setData({
          carts: data?.carts || [],
          totalPage: data?.totalPage || 0,
        });
      })
      .finally(() => setLoading(false));
  }, [page, pageSize]);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "2rem",
      }}
    >
      <TableTemplate
        ariaLabel="cart-table"
        tHeads={
          <>
            <StyledTableCell sx={{ width: "40px !important" }}>
              ID
            </StyledTableCell>
            <StyledTableCell sx={{ width: "400px !important" }} align="left">
              Products
            </StyledTableCell>
            <StyledTableCell sx={{ width: "200px !important" }} align="right">
              Products Qty
            </StyledTableCell>
            <StyledTableCell sx={{ width: "200px !important" }} align="right">
              Total Products Qty
            </StyledTableCell>
            <StyledTableCell sx={{ width: "200px !important" }} align="right">
              Total Price
            </StyledTableCell>
            <StyledTableCell sx={{ width: "200px !important" }} align="right">
              Discounted Total Price
            </StyledTableCell>
          </>
        }
        tRows={data?.carts?.map((row) => (
          <TableRow
            key={row.id}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.id}
            </TableCell>
            <TableCell align="left" sx={{ cursor: "pointer" }}>
              <Link href={`/carts/${row.id}`}>
                <span style={{ color: "#1976D2" }}>
                  {row.products
                    .splice(0, 2)
                    .map((pr) => pr.title)
                    .join(", ")}
                </span>
                {row.totalProducts > 2 && (
                  <span style={{ color: "lightslategray" }}>
                    {" "}
                    + {row.totalProducts - 2} other products
                  </span>
                )}
              </Link>
            </TableCell>
            <TableCell align="right">{row.totalProducts}</TableCell>
            <TableCell align="right">{row.totalQuantity}</TableCell>
            <TableCell align="right">${row.total}</TableCell>
            <TableCell align="right">${row.discountedTotal}</TableCell>
          </TableRow>
        ))}
        isLoading={isLoading}
        isEmpty={data?.carts?.length === 0}
      />

      {data?.totalPage > 0 && (
        <Pagination
          onChange={setPage}
          page={page}
          totalPage={data?.totalPage}
          disableNext={isLoading}
          disablePrev={isLoading}
        />
      )}
    </main>
  );
}
