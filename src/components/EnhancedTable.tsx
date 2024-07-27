import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import InfoIcon from "@mui/icons-material/Info";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Button from "@mui/material/Button";
import { visuallyHidden } from "@mui/utils";
import { alpha } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { toast } from "react-toastify";
import useTable from "./useTable";
import { BookData, Order } from "./tableUtils";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from '@mui/icons-material/Close';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderColor: "#120e1f",
  backgroundColor: "rgb(237, 231, 246)",
}));

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  fontWeight: "bold",
}));

const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "rgb(237, 231, 246)",
  fontWeight: "bold",
  textTransform: "uppercase",
}));

interface HeadCell {
  disablePadding: boolean;
  id: keyof BookData;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "coverImage", numeric: false, disablePadding: true, label: "Cover Image" },
  { id: "title", numeric: false, disablePadding: true, label: "Title" },
  { id: "author", numeric: false, disablePadding: false, label: "Author" },
  { id: "year", numeric: true, disablePadding: false, label: "Year" },
  { id: "genre", numeric: false, disablePadding: false, label: "Genre" },
];

interface EnhancedTableProps {
  filterValue: string;
  wishlist: BookData[];
  setWishlist: React.Dispatch<React.SetStateAction<BookData[]>>;
  rows: BookData[];
  setRows: React.Dispatch<React.SetStateAction<BookData[]>>;
}

interface EnhancedTableHeadProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof BookData;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof BookData
  ) => void;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof BookData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead className="container">
      <TableRow>
        <HeaderTableCell padding="checkbox">
          <Checkbox
            color="secondary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all books" }}
          />
        </HeaderTableCell>
        {headCells.map((headCell) => (
          <HeaderTableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <StyledTableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </StyledTableSortLabel>
          </HeaderTableCell>
        ))}
        <HeaderTableCell>Actions</HeaderTableCell>
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  onDelete: () => void;
  onCreateOrUpdate: (book: BookData) => void;
  editingBook: BookData | null;
  setEditingBook: React.Dispatch<React.SetStateAction<BookData | null>>;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    onDelete,
    onCreateOrUpdate,
    editingBook,
    setEditingBook,
  } = props;

  const [book, setBook] = useState<BookData>({
    id: 0,
    title: "",
    author: "",
    year: new Date().getFullYear(),
    genre: "",
    coverImage: "", // Add this line
    quantity: 0,
  });

  useEffect(() => {
    if (editingBook) {
      setBook(editingBook);
    } else {
      setBook({
        id: 0,
        title: "",
        author: "",
        year: new Date().getFullYear(),
        genre: "",
        coverImage: "", // Add this line
        quantity: 0,
      });
    }
  }, [editingBook]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: name === "year" ? parseInt(value, 10) : value });
  };

  const handleCreateOrUpdate = () => {
    if (!book.title || !book.author || !book.year || !book.genre) {
      alert("Please fill out all fields.");
      return;
    }

    onCreateOrUpdate(book);
    setBook({
      id: 0,
      title: "",
      author: "",
      year: new Date().getFullYear(),
      genre: "",
      coverImage: "", // Add this line
      quantity: 0,
    });
    setEditingBook(null);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.secondary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%", fontSize: 24, fontWeight: 600, color: "#4A4A4A" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Library
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <TextField
            label="Title"
            name="title"
            value={book.title}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mx: 1 }}
          />
          <TextField
            label="Author"
            name="author"
            value={book.author}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mx: 1 }}
          />
          <TextField
            label="Year"
            name="year"
            type="number"
            value={book.year}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mx: 1 }}
          />
          <TextField
            label="Genre"
            name="genre"
            value={book.genre}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mx: 1 }}
          />
          <TextField
            label="Cover Image URL"
            name="coverImage"
            value={book.coverImage} // Add this line
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mx: 1 }}
          />
          <Tooltip title={book.id === 0 ? "Create" : "Update"}>
            <IconButton onClick={handleCreateOrUpdate}>
              {book.id === 0 ? <AddIcon /> : <UpdateIcon />}
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>
  );
}

export default function EnhancedTable({
  filterValue,
  wishlist,
  setWishlist,
  rows,
  setRows,
}: EnhancedTableProps) {
  const dispatch = useDispatch();
  const [editingBook, setEditingBook] = useState<BookData | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredRows = rows.filter(
    (row) =>
      row.title.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.author.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.genre.toLowerCase().includes(filterValue.toLowerCase())
  );

  const {
    order,
    orderBy,
    selected,
    page,
    dense,
    rowsPerPage,
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChangeDense,
    isSelected,
    emptyRows,
    visibleRows,
  } = useTable(filteredRows);

  const handleDelete = () => {
    const newRows = rows.filter((row) => !selected.includes(row.id));
    setRows(newRows);
  };

  const handleCreateOrUpdateBook = (book: BookData) => {
    setRows((prevRows) => {
      const existingIndex = prevRows.findIndex((row) => row.id === book.id);
      if (existingIndex !== -1) {
        const updatedRows = [...prevRows];
        updatedRows[existingIndex] = book;
        return updatedRows;
      } else {
        return [...prevRows, book];
      }
    });
    setEditingBook(null);
  };

  const handleViewDetails = (book: BookData) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  const handleAddToCart = (book: BookData) => {
    dispatch(addToCart(book));
    toast.success(`${book.title} added to cart!`);
  };

  const handleToggleWishlist = (book: BookData) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.some((item) => item.id === book.id)) {
        return prevWishlist.filter((item) => item.id !== book.id);
      } else {
        return [...prevWishlist, book];
      }
    });
  };

  function handleRemoveFromWishlist(id: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onDelete={handleDelete}
          onCreateOrUpdate={handleCreateOrUpdateBook}
          editingBook={editingBook}
          setEditingBook={setEditingBook}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
           <TableBody>
  {visibleRows.map((row: BookData, index: number) => {
    const isItemSelected = isSelected(row.id);
    const labelId = `enhanced-table-checkbox-${index}`;
    const isWishlisted = wishlist.some((book) => book.id === row.id);

    return (
      <TableRow
        hover
        onClick={(event: React.MouseEvent<unknown>) => handleClick(event, row.id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
        sx={{ cursor: "pointer" }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="secondary"
            checked={isItemSelected}
            inputProps={{ "aria-labelledby": labelId }}
          />
        </TableCell>
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="none"
          style={{ textAlign: "left" }} // Apply custom style here
        >
          {row.coverImage && (
            <img src={row.coverImage} alt={row.title} style={{ width: 50, height: 50 }} />
          )}
        </TableCell>
        <TableCell align="left">{row.title}</TableCell> {/* Ensure alignment is left */}
        <TableCell align="left">{row.author}</TableCell> {/* Ensure alignment is left */}
        <TableCell align="left">{row.year}</TableCell> {/* Ensure alignment is left */}
        <TableCell align="left">{row.genre}</TableCell> {/* Ensure alignment is left */}
        <TableCell align="left">
          <Tooltip title="View Details">
            <IconButton onClick={() => handleViewDetails(row)}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Update Book">
            <IconButton onClick={() => setEditingBook(row)}>
              <UpdateIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add to Cart">
            <IconButton onClick={() => handleAddToCart(row)}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle Wishlist">
            <IconButton onClick={() => handleToggleWishlist(row)}>
              <FavoriteIcon color={isWishlisted ? "secondary" : "inherit"} />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  })}
  {emptyRows > 0 && (
    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
      <TableCell colSpan={6} />
    </TableRow>
  )}
</TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: "0 4px 20px 0 rgba(102, 49, 255, .15)",
            p: 4,
            background: "linear-gradient(180deg, #eff6ff 0.55%, #dce0fc 98%)",
            borderColor: "#b1bacb",
            borderRadius: "10px",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              fontSize: 20,
              fontWeight: 600,
              color: "rgb(30, 58, 138)",
            }}
          >
            Book Details
          </Typography>
          {selectedBook && (
            <>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Title:</strong> {selectedBook.title}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Author:</strong> {selectedBook.author}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Year:</strong> {selectedBook.year}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Genre:</strong> {selectedBook.genre}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Description:</strong> Detailed description about the book.
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Price:</strong> $19.99
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Reviews:</strong> 4.5/5 (200 reviews)
              </Typography>
            </>
          )}
        </Box>
      </Modal>
      <Modal
        open={wishlistModalOpen}
        onClose={() => setWishlistModalOpen(false)}
        aria-labelledby="wishlist-modal-title"
        aria-describedby="wishlist-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            padding: 32,
            paddingTop: 60,
            paddingRight: 100,
            paddingBottom: 60,
            paddingLeft: 100,
            background: "linear-gradient(180deg, #eff6ff 0.55%, #dce0fc 98%)",
            borderColor: "#b1bacb",
            borderStyle: "none",
            borderRadius: 20,
            boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.08)",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setWishlistModalOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="wishlist-modal-title" variant="h6" component="h2">
            Wishlist
          </Typography>
          {wishlist.length === 0 ? (
            <Typography id="wishlist-modal-description" sx={{ mt: 2 }}>
              No items in the wishlist.
            </Typography>
          ) : (
            wishlist.map((book) => (
              <Box key={book.id} sx={{ mt: 2 }}>
                <Typography id="wishlist-modal-description" sx={{ mt: 2 }}>
                  <strong>{book.title}</strong> by {book.author}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveFromWishlist(book.id)}
                  sx={{ mr: 1 }}
                >
                  Remove
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleAddToCart(book)}
                >
                  Add to Cart
                </Button>
              </Box>
            ))
          )}
        </Box>
      </Modal>
    </Box>
  );
}
