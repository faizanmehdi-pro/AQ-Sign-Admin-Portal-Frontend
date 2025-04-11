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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewIcon from "@mui/icons-material/RemoveRedEyeRounded";
import { Modal } from "@mui/material";
import UpdateGroup from "./GroupsForms/UpdateGroup";

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function createData(id) {
  const groupNames = ["Group A", "Group B", "Group C", "Group D", "Group E"];
  const status = ["Active", "Inactive"];
  const groupDescriptions = ["Admin Group", "Support Group", "User Group", "Test Group", "Trial Group"];
  const customerCount = Math.floor(Math.random() * 100); // Random number between 0 and 100

  return {
    id,
    groupName: getRandomItem(groupNames),
    status: getRandomItem(status),
    groupDescription: getRandomItem(groupDescriptions),
    customerCount,
  };
}

const initialRows = Array.from({ length: 200 }, (_, index) => createData(index));

export default function GroupsListTable() {
  const [data, setData] = React.useState(initialRows);
  const [searchGroupName, setSearchGroupName] = React.useState("");
  const [searchStatus, setSearchStatus] = React.useState("");
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState(null);

  const handleDelete = (id) => {
    setData(data.filter((row) => row.id !== id));
    setOpenDeleteModal(false);
  };

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setOpenEditModal(true);
  };

  const handleSaveEdit = () => {
    setData(data.map((row) => (row.id === selectedGroup.id ? selectedGroup : row)));
    setOpenEditModal(false);
  };

  const filteredData = data.filter(
    (row) =>
      row.groupName.toLowerCase().includes(searchGroupName.toLowerCase()) &&
      row.status.toLowerCase().includes(searchStatus.toLowerCase())
  );

  return (
    <>
      <div style={{ display: "flex", gap: "16px", width: "350px" }}>
        <TextField
          label="Search Group"
          variant="outlined"
          size="small"
          fullWidth
          value={searchGroupName}
          onChange={(e) => setSearchGroupName(e.target.value)}
        />
      </div>
      <Paper style={{ height: "60vh", width: "100%" }}>
        <TableContainer
          style={{ maxHeight: "100%" }}
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
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Group Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Customers</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Group Description</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.groupName}</TableCell>
                  <TableCell>{row.customerCount}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.groupDescription}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(row)}>
                      <EditIcon sx={{ fontSize: "16px", color: "#1976d2" }} />
                    </IconButton>
                    <IconButton onClick={() => { setSelectedGroup(row); setOpenDeleteModal(true); }}>
                      <DeleteIcon sx={{ fontSize: "16px", color: "red" }} />
                    </IconButton>
                    {/* <IconButton>
                      <ViewIcon sx={{ fontSize: "16px", color: "#1976d2" }} />
                    </IconButton> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this group?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
          <Button color="error" onClick={() => handleDelete(selectedGroup.id)}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Group Modal */}
      <Modal open={openEditModal}>
        <UpdateGroup setOpenEditModal={setOpenEditModal} />
      </Modal>
    </>
  );
}
