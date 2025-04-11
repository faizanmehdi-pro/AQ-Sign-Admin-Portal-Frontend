import React, { useState, useEffect } from "react";
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
import { Box, Divider, TablePagination, Button, Checkbox } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { allDocumentsList } from "../../APIS/Documents/allDocumentsList";
import { deleteDocument } from "../../APIS/Documents/deleteDocument";
import { ListLoader, LoaderContainer } from "../ManageForms/ManageForm";

export default function DocumentsListTable({ setFileView, setSelectedDocumentID, setSelectedCustomerID, setSelectedSignatureImg }) {
  const queryClient = useQueryClient();
  const [searchDocumentName, setSearchDocumentName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // Debounce search input to reduce API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchDocumentName);
    }, 300); // Wait 300ms before updating the search

    return () => clearTimeout(handler);
  }, [searchDocumentName]);

  // Fetch documents using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["documents", page, rowsPerPage],
    queryFn: () => allDocumentsList({ pageNumber: page + 1, RowLimit: rowsPerPage }),
    keepPreviousData: false,
  });

  const mutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries(["documents"]);
      setOpenDeleteModal(false);
      toast.success("Document Deleted Successfully!");
    },
  });

  const documents = Array.isArray(data?.results) ? data?.results : [];

  if (isLoading) return <LoaderContainer><ListLoader /></LoaderContainer>;
  if (isError) return <p>Error: {error.message}</p>;

  // Filtered data based on search query
  const filteredData = documents.filter((doc) => {
    const documentName = doc.documents ? doc.documents.split("/").pop() : "";
    return documentName.toLowerCase().includes(debouncedSearch.toLowerCase());
  });

  const handleViewDocument = (id, customerID, signature) => {
    setFileView(true);
    setSelectedDocumentID(id);
    setSelectedCustomerID(customerID);
    setSelectedSignatureImg(signature);
  };

  const handleDelete = (id) => {
    setSelectedDocument(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = () => {
    setLoading(true);
    if (selectedDocument) {
      mutation.mutate(selectedDocument);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {/* Search Input */}
      <div style={{ display: "flex", gap: "16px", width: "350px" }}>
        <TextField
          label="Search Document by Name"
          variant="outlined"
          size="small"
          fullWidth
          value={searchDocumentName}
          onChange={(e) => setSearchDocumentName(e.target.value)}
        />
      </div>

      <Paper>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Document Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Customers</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {row.documents ? (
                      <a href={row.documents} target="_blank" rel="noopener noreferrer">
                        {row.documents.split("/").pop()}
                      </a>
                    ) : (
                      "No Document"
                    )}
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={row.is_signature} disabled />
                    {row.customer[0]?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {/* <IconButton>
                        <EditIcon sx={{ fontSize: "16px", color: "#1976d2" }} />
                      </IconButton> */}
                      <IconButton onClick={() => handleViewDocument(row?.id, row.customer[0]?.id || "null", row.customer[0]?.signature || "null")}>
                      <EditIcon sx={{ fontSize: "16px", color: "#1976d2" }} />
                      </IconButton>
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
        </TableContainer>
        
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={data?.count || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this document?</DialogContent>
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
