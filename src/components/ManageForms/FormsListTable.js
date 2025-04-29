import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Box, Divider, TablePagination, Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getFormsList } from "../../APIS/ManageForms/getFormsList";
import { deleteForm } from "../../APIS/ManageForms/deleteForm";
import { ListLoader, LoaderContainer } from "./UpdateForm";

export default function FormsListTable({ setActiveView, setFormID }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [imgError, setImgError] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["forms", page, rowsPerPage],
    queryFn: () => getFormsList({ pageNumber: page + 1, RowLimit: rowsPerPage }),
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: deleteForm,
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries(["forms"]);
      setOpenDeleteModal(false);
      toast.success("Form deleted successfully!");
    },
    onError: () => {
      setLoading(false);
      toast.error("Failed to delete form.");
    }
  });

  const forms = Array.isArray(data?.results?.response?.data) ? data.results?.response?.data : [];


  const handleImgError = (id) => {
    setImgError((prev) => ({ ...prev, [id]: true }));
  };

  const handleView = (id) => {
    setActiveView("update");
    setFormID(id);
  };

  const handleDelete = (id) => {
    setSelectedFormId(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedFormId) {
      setLoading(true);
      mutation.mutate(selectedFormId);
    }
  };

  const searchTerm = debouncedSearch?.toLowerCase?.() || '';

  const filteredData = forms.filter((form) => {
    const title = form.titles?.[0] || form.document_name || "";
    return title.toLowerCase().includes(searchTerm);
  });
  
  

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <LoaderContainer>
          <ListLoader />
        </LoaderContainer>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <div style={{ display: "flex", gap: "16px", width: "350px", marginBottom: "16px" }}>
        <TextField
          label="Search Form by Title"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Paper>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Preview</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Form Title</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    {/* {!imgError[form.id] && form.thumbnail ? (
                      <img
                        src={form.thumbnail}
                        alt="Form Thumbnail"
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: 4 }}
                        onError={() => handleImgError(form.id)}
                      />
                    ) : ( */}
                      <InsertDriveFileIcon sx={{ fontSize: 40, color: "#90caf9" }} />
                    {/* )} */}
                  </TableCell>
                  <TableCell>{form?.titles?.[0] || 'N/A'}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <IconButton onClick={() => handleView(form.id)}>
                        <EditIcon sx={{ fontSize: "16px", color: "#1976d2" }} />
                      </IconButton>
                      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                      <IconButton onClick={() => handleDelete(form.id)}>
                        <DeleteIcon sx={{ fontSize: "16px", color: "red" }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={data?.count || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this form?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
