import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import { FormContainer, FormTopbar } from "./Forms.styles";

const initialRows = Array.from({ length: 200 }, (_, index) => ({
  id: index,
  name: `Customer ${index + 1}`,
  email: `customer${index + 1}@example.com`,
  status: index % 2 === 0 ? "Signed" : "Pending",
  emailDescription: "Sample Description",
}));

export default function UpdateGroup({ setOpenEditModal }) {
  const [data, setData] = React.useState(initialRows);
  const [selectedCustomers, setSelectedCustomers] = React.useState([]);
  const [searchName, setSearchName] = React.useState("");
  const [searchEmail, setSearchEmail] = React.useState("");
  const [searchStatus, setSearchStatus] = React.useState("");
  
  const handleSelectAll = (event) => {
    setSelectedCustomers(event.target.checked ? data.map((row) => row.id) : []);
  };

  const handleSelectCustomer = (id) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const filteredData = data.filter(
    (row) =>
      row.name.toLowerCase().includes(searchName.toLowerCase()) &&
      row.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      row.status.toLowerCase().includes(searchStatus.toLowerCase())
  );

  return (
    <FormContainer>
      <FormTopbar>
        <h2>Update Group</h2>
        <IconButton edge="end" color="inherit" onClick={() => setOpenEditModal(false)}>
          <CloseIcon />
        </IconButton>
      </FormTopbar>

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
          onChange={(e) => setSearchStatus(e.target.value)}
        />
      </div>

      <Paper style={{ height: "320px", width: "100%" }}>
        <TableContainer style={{ maxHeight: "100%" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedCustomers.length > 0 &&
                      selectedCustomers.length < data.length
                    }
                    checked={selectedCustomers.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                  Customer Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                  Email Description
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomers.includes(row.id)}
                      onChange={() => handleSelectCustomer(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.emailDescription}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Button
        variant="contained"
        color="primary"
        style={{ alignSelf: "flex-end", marginTop: 10, right: 20 }}
      >
        Update Group
      </Button>
    </FormContainer>
  );
}
