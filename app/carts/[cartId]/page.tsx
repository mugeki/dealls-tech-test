"use client";
import { ProductCart } from "@/app/api/carts/[cartId]/route";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import axios from "axios";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import * as React from "react";
import Pagination from "../../components/pagination";
import StyledTableCell from "../../components/styledTableCell";
import TableTemplate from "../../components/tableTemplate";

export default function CartDetail() {
  const { cartId } = useParams();

  const pageSize = 10;
  const [page, setPage] = React.useState<number>(1);
  const [data, setData] = React.useState({
    totalQty: 0,
    totalAmount: 0,
    addedOn: null,
    userName: "",
    products: [],
    totalPage: 0,
  });

  const [isLoading, setLoading] = React.useState(true);

  // Fetch Cart Detail
  React.useEffect(() => {
    if (cartId) {
      setLoading(true);
      axios
        .get(`/api/carts/${cartId}`, {
          params: {
            size: pageSize,
            page: page,
          },
        })
        .then((res) => {
          const data = res.data;
          setData({
            totalQty: data?.totalQuantity,
            totalAmount: data?.total || 0,
            addedOn: data?.createdAt,
            userName: data?.userName,
            products: data?.products || [],
            totalPage: data?.totalPage || 0,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [page, pageSize, cartId]);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        padding: "2rem",
      }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Cart {cartId}
      </Typography>

      {/* Cart Detail Section ======== */}
      <Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Detail
        </Typography>
        <Card sx={{ minWidth: 275 }}>
          <CardContent
            sx={{
              display: "flex",
              gap: "5rem",
            }}
          >
            {isLoading ? (
              <CircularProgress sx={{ margin: "0.25rem auto" }} />
            ) : (
              <>
                <Box>
                  <Typography>
                    <span style={{ fontWeight: 600 }}>User:</span>{" "}
                    {data.userName}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: 600 }}>Added On:</span>{" "}
                    {dayjs(data.addedOn).format("D MMM YYYY")}
                  </Typography>
                </Box>
                <Box>
                  <Typography>
                    <span style={{ fontWeight: 600 }}># of Items:</span>{" "}
                    {data.totalQty}
                  </Typography>

                  <Typography>
                    <span style={{ fontWeight: 600 }}>Total Amount:</span> $
                    {data.totalAmount}
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Products Section ======== */}
      <Box sx={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Products
        </Typography>
        <TableTemplate
          ariaLabel="cart-product-table"
          tHeads={
            <>
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell align="right">Brand</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="right">Stock</StyledTableCell>
              <StyledTableCell align="right">Category</StyledTableCell>
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
          tRows={data?.products?.map((row: ProductCart) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell align="right">{row.detail?.brand}</TableCell>
              <TableCell align="right">${row.detail?.price}</TableCell>
              <TableCell align="right">{row.detail?.stock}</TableCell>
              <TableCell align="right">{row.detail?.category}</TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">${row.total}</TableCell>
              <TableCell align="right">${row.discountedPrice}</TableCell>
            </TableRow>
          ))}
          isLoading={isLoading}
          isEmpty={data?.products?.length === 0}
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
      </Box>
    </main>
  );
}
