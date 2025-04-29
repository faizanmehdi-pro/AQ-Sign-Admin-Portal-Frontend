import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewIcon from "@mui/icons-material/RemoveRedEyeRounded";
import { Box, Divider, Modal, TablePagination } from "@mui/material";
import UpdateCustomer from "./CustomerForms/UpdateCustomer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomer } from "../../APIS/Customer/deleteCustomer";
import { toast } from "react-toastify";
import { allCustomersList } from "../../APIS/Customer/allCustomersList";
import { ListLoader, LoaderContainer } from "../ManageForms/CreateForm";
import { Loader } from "../Auth/LoginForm";
import { Button } from "./CustomerForms/Forms.styles";

export default function CustomersListTable({ setFileView }) {
  const queryClient = useQueryClient();
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchStatus, setStatus] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // Fetch customers using useQuery
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["customers", page, rowsPerPage],
    queryFn: () => allCustomersList({ pageNumber: page + 1, RowLimit: rowsPerPage }), // Pass as an object
    keepPreviousData: false,
  });
  
  const mutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries(["customers"]);
      setOpenDeleteModal(false);
      toast.success("Customer Deleted Successfully!");
    },
  });

  const customers = Array.isArray(data?.results) ? data?.results : [];
  
  if (isLoading) return <LoaderContainer><ListLoader /></LoaderContainer>;
  if (isError) return <p>Error: {error.message}</p>;
  
  // Apply filters safely
  const filteredData = customers.filter((row) => {
    const name = row.name ? row.name.toLowerCase() : "";
    const email = row.email ? row.email.toLowerCase() : "";
    const customer_status = row.customer_status ? row.customer_status.toLowerCase() : "";
  
    return (
      name.includes(searchName.toLowerCase()) &&
      email.includes(searchEmail.toLowerCase()) &&
      customer_status.includes(searchStatus.toLowerCase())
    );
  });


  const handleViewDocument = (id) => {
    setFileView(true);
  };

  const handleEdit = (id) => {
    setSelectedCustomer(id);
    setOpenEditModal(true);
  };

  const handleDelete = (id) => {
    setSelectedCustomer(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = () => {
    setLoading(true);
    if (selectedCustomer) {
      mutation.mutate(selectedCustomer);
    }
  };
// Pagination handlers
// Pagination handlers
const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value));
  setPage(0);
};

  return (
    <>
      {/* Search Inputs */}
      <div style={{ display: "flex", gap: "16px" }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          fullWidth
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <TextField
          label="Search by Email"
          variant="outlined"
          size="small"
          fullWidth
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <TextField
          label="Search by Status"
          variant="outlined"
          size="small"
          fullWidth
          value={searchStatus}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      <Paper>
        <TableContainer
          sx={{
            "&::-webkit-scrollbar": {
              width: "10px",
              height: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#1976d2",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Phone Number</TableCell>
                {/* <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Stauts</TableCell> */}
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone_number}</TableCell>
                  {/* <TableCell>{row.customer_status}</TableCell> */}
                  <TableCell>
  <Box display="flex" alignItems="center">
    <IconButton onClick={() => handleEdit(row.id)}>
      <EditIcon sx={{ fontSize: "16px", color: "#1976d2" }} />
    </IconButton>
    {/* <IconButton onClick={() => handleViewDocument(row.id)}>
      <ViewIcon sx={{ fontSize: "16px", color: "#1976d2" }} />
    </IconButton> */}
    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
    <IconButton onClick={() => handleDelete(row.id)}>
      <DeleteIcon sx={{ fontSize: "16px", color: "red" }} />
    </IconButton>
  </Box>
</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        <TablePagination
          rowsPerPageOptions={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          component="div"
          count={data?.count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </TableContainer>
      </Paper>        
{/* 
<TablePagination
  rowsPerPageOptions={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
  component="div"
  count={data?.count || 0}
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  labelDisplayedRows={({ from, to, count }) => `Page ${page + 1} of ${Math.ceil(count / rowsPerPage)}`}
/> */}

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this customer?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
          <Button type="submit" onClick={confirmDelete} disabled={loading}>
            {loading ? <Loader /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Customer Modal */}
      <Modal open={openEditModal}>
        <UpdateCustomer setOpenEditModal={setOpenEditModal} customerId={selectedCustomer}/>
      </Modal>
    </>
  );
}
