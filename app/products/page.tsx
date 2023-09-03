"use client";
import ClearIcon from "@mui/icons-material/Clear";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import * as React from "react";
import { Bar } from "react-chartjs-2";
import { Product } from "../api/products/route";
import Pagination from "../components/pagination";
import StyledTableCell from "../components/styledTableCell";
import TableTemplate from "../components/tableTemplate";
import useDebounce from "../hooks/useDebounce";
import useSaveQueryParams, {
  SaveQueryParams,
} from "../hooks/useSaveQueryParams";

type PriceRange = [number | undefined, number | undefined];
type Filters = {
  name?: string | undefined;
  category?: string | undefined;
  brand?: string | undefined;
  priceRange: PriceRange;
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const barOptionsActual = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: "#FFFFFF",
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const barOptionsBG = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#FFFFFF00",
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const maxPrice = 2000;

export default function Products() {
  const pageSize = 10;
  const [page, setPage] = React.useState<number>(1);
  const [data, setData] = React.useState({
    totalPage: 0,
    products: [],
    barData: {
      labels: [],
      data: [],
    },
  });

  const { initParamsObj, saveQueryParams, bulkSaveQueryParams } =
    useSaveQueryParams("products") as SaveQueryParams & {
      initParamsObj: Filters;
    };

  const [filters, setFilters] = React.useState<Filters>({
    name: initParamsObj?.name,
    category: initParamsObj?.category,
    brand: initParamsObj?.brand,
    priceRange: [
      +(initParamsObj?.priceRange?.[0] || 0),
      +(initParamsObj?.priceRange?.[1] || maxPrice),
    ],
  });

  // Debounce some filter value with high freq of changing to avoid overload API fetch
  const dbcName: string = useDebounce(filters.name, 500);
  const dbcPriceRange: PriceRange = useDebounce(filters.priceRange, 500);

  const [isLoading, setLoading] = React.useState(true);

  const [categoryItems, setCategoryItems] = React.useState<string[]>([]);
  const [brandItems, setBrandItems] = React.useState<string[]>([]);

  const handleApplyFilter = (values: Filters) => {
    setFilters({ ...values, name: filters.name });
    bulkSaveQueryParams(values);
  };

  const changeFilters = (name: string, value: PriceRange | string | null) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [name]: value }));
    saveQueryParams(name, value);
  };

  // Fetch Products
  React.useEffect(() => {
    setLoading(true);
    axios
      .get("/api/products", {
        params: {
          size: pageSize,
          page: page,
          search: dbcName,
          category: filters.category,
          brand: filters.brand,
          "price-start": dbcPriceRange[0],
          "price-end": dbcPriceRange[1],
        },
      })
      .then((res) => {
        const data = res.data;
        setData({
          products: data?.products || [],
          barData: data?.productsChart || [],
          totalPage: data?.totalPage || 0,
        });
        setBrandItems(data?.brands);
      })
      .finally(() => setLoading(false));
  }, [page, pageSize, filters.brand, filters.category, dbcName, dbcPriceRange]);

  // Fetch Category dropdown items
  React.useEffect(() => {
    axios.get("https://dummyjson.com/products/categories").then((res) => {
      setCategoryItems(res.data);
    });
  }, []);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "2rem",
      }}
    >
      <FilterSection
        filters={filters}
        categoryItems={categoryItems}
        brandItems={brandItems}
        onApply={handleApplyFilter}
        onChangeField={changeFilters}
      />

      <TableTemplate
        ariaLabel="product-table"
        tHeads={
          <>
            <StyledTableCell>Product Name</StyledTableCell>
            <StyledTableCell align="right">Brand</StyledTableCell>
            <StyledTableCell align="right">Price</StyledTableCell>
            <StyledTableCell align="right">Stock</StyledTableCell>
            <StyledTableCell align="right">Category</StyledTableCell>
          </>
        }
        tRows={data?.products?.map((row: Product) => (
          <TableRow
            key={row.id}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.title}
            </TableCell>
            <TableCell align="right">{row.brand}</TableCell>
            <TableCell align="right">${row.price}</TableCell>
            <TableCell align="right">{row.stock}</TableCell>
            <TableCell align="right">{row.category}</TableCell>
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

      {/* Product Cart Section ======== */}
      <Box sx={{ position: "relative", mt: "4rem" }}>
        {/* Background Chart */}
        <Box
          zIndex={1}
          sx={{
            position: "absolute",
          }}
        >
          <Box sx={{ width: "500vw", height: 500 }}>
            <Bar
              options={barOptionsBG}
              data={{
                labels: data.barData.labels,
                datasets: [
                  {
                    label: "Stocks",
                    data: data.barData.data,
                    backgroundColor: "#FFFFFF00",
                  },
                ],
              }}
            />
          </Box>
        </Box>

        {/* Actual Chart */}
        <Box zIndex={2} sx={{ pl: "35px" }}>
          <Box
            sx={{
              width: "100%",
              overflowX: "scroll",
            }}
          >
            <Box sx={{ width: "500vw", height: 500 }}>
              <Bar
                options={barOptionsActual}
                data={{
                  labels: data.barData.labels,
                  datasets: [
                    {
                      label: "Stocks",
                      data: data.barData.data,
                      backgroundColor: "#1976D2",
                    },
                  ],
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </main>
  );
}

type FilterSectionProps = {
  filters: Filters;
  categoryItems: string[];
  brandItems: string[];
  onApply: (values: Filters) => void;
  onChangeField: (name: string, value: PriceRange | string | null) => void; // Used to update the `filters` prop
};
function FilterSection({
  filters,
  categoryItems,
  brandItems,
  onApply,
  onChangeField,
}: FilterSectionProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [open, setOpen] = React.useState<boolean>(false);
  const [values, setValues] = React.useState<Filters>({
    name: filters?.name,
    category: filters?.category,
    brand: filters?.brand,
    priceRange: [
      filters?.priceRange[0] || 0,
      filters?.priceRange[1] || maxPrice,
    ],
  });

  const handleClose = (e: React.SyntheticEvent<unknown>, reason?: string) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };
  const changeValues = (name: string, value: PriceRange | string | null) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (isDesktop || name === "name") onChangeField(name, value);
  };
  const changePriceRange = (e: Event, newValue: number | number[]) => {
    changeValues("priceRange", newValue as PriceRange);
  };

  const additionalFilters = (
    <>
      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          flexShrink: 0,
          width: { xs: "100%", lg: 300 },
        }}
      >
        <span style={{ fontWeight: 500, marginTop: "0.5rem" }}>Price: </span>
        <Slider
          getAriaLabel={() => "Price range"}
          min={0}
          max={maxPrice}
          step={10}
          valueLabelDisplay="on"
          value={values.priceRange as number[]}
          onChange={changePriceRange}
          getAriaValueText={(value: number) => `$${value}`}
          disableSwap
          marks={[
            { value: 0, label: "$0" },
            { value: maxPrice, label: `$${maxPrice}` },
          ]}
          sx={{ width: "95%", mr: "2rem" }}
        />
      </Box>
      <FormControl
        sx={{ flexShrink: 0, width: { xs: "100%", lg: 200 } }}
        size="small"
      >
        <InputLabel htmlFor="product-brand">Brand</InputLabel>
        <Select
          labelId="product-brand"
          id="product-brand"
          value={values.brand}
          label="Brand"
          placeholder="Choose Brand"
          size="small"
          onChange={(e: SelectChangeEvent) =>
            changeValues("brand", e.target.value as string)
          }
          endAdornment={
            <IconButton
              sx={{ visibility: values.brand ? "visible" : "hidden" }}
              onClick={() => changeValues("brand", null)}
            >
              <ClearIcon />
            </IconButton>
          }
        >
          {brandItems.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        sx={{ flexShrink: 0, width: { xs: "100%", lg: 200 } }}
        size="small"
      >
        <InputLabel htmlFor="product-category">Category</InputLabel>
        <Select
          labelId="product-category"
          id="product-category"
          value={values.category}
          label="Category"
          placeholder="Choose Category"
          size="small"
          onChange={(e: SelectChangeEvent) =>
            changeValues("category", e.target.value as string)
          }
          endAdornment={
            <IconButton
              sx={{ visibility: values.category ? "visible" : "hidden" }}
              onClick={() => changeValues("category", null)}
            >
              <ClearIcon />
            </IconButton>
          }
        >
          {categoryItems.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: "0.5rem",
          marginLeft: "auto",
        }}
      >
        {isDesktop && additionalFilters}

        <TextField
          id="input-search-product"
          label="Search Product"
          variant="outlined"
          size="small"
          value={values.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            changeValues("name", e.target.value as string)
          }
          sx={{ width: "100%" }}
        />

        {!isDesktop && (
          <IconButton
            aria-label="filter-dialog-opener"
            onClick={() => setOpen(true)}
          >
            <FilterAltIcon />
          </IconButton>
        )}
      </Box>
      <Dialog
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={"sm"}
      >
        <DialogTitle fontWeight={700}>Filter Products</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              px: "0.5rem",
              pb: "0.75rem",
              pt: "2rem",
              gap: "1.5rem",
            }}
          >
            {additionalFilters}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              setOpen(false);
              onApply(values);
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
