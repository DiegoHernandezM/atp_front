import React, { useState } from "react";
import styled from "@emotion/styled";
import { MoreVertical } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../../redux/slices/dashboard";

import { Card as MuiCard, CardHeader, IconButton, Paper } from "@mui/material";
import { DataGrid, esES } from "@mui/x-data-grid";
import { spacing } from "@mui/system";
import QuickSearch from "../../tables/QuickSearch";
import UserProgress from "./UserProgress";

const Card = styled(MuiCard)(spacing);

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const DashboardTable = ({ users }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.dashboard);
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = users.filter((row) =>
      Object.keys(row).some((field) => searchRegex.test(row[field]))
    );
    setRows(filteredRows);
  };
  const columns = [
    {
      field: "name",
      headerName: "Nombre",
      width: 180,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
    },
    {
      field: "school",
      headerName: "Escuela",
      width: 100,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
      renderCell: (params) =>
        params.row.school === null ? "Sin dato" : params.row.school,
    },
    {
      field: "type_id",
      headerName: "Tipo",
      width: 100,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
      renderCell: (params) =>
        params.row.type_id === 1 ? "Admin" : "Estudiante",
    },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card mb={6}>
      <CardHeader
        action={
          <IconButton aria-label="settings" size="large">
            <MoreVertical />
          </IconButton>
        }
        title="Progreso"
      />
      <Paper>
        <div style={{ height: 445, width: "100%" }}>
          <DataGrid
            components={{
              Toolbar: QuickSearch,
            }}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 5 } },
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            pageSizeOptions={[5, 10, 25]}
            rows={rows.length > 0 ? rows : users}
            rowHeight={40}
            columns={columns}
            onRowDoubleClick={(params) => {
              dispatch(getUser(params.row.id));
              setOpen(true);
            }}
            componentsProps={{
              hideFooterPagination: false,
              toolbar: {
                export: false,
                columns: true,
                density: true,
                search: true,
                value: searchText,
                onChange: (event) => requestSearch(event.target.value),
                clearSearch: () => requestSearch(""),
              },
            }}
            pageSize={10}
          />
        </div>
      </Paper>
      <UserProgress open={open} close={handleClose} progress={user} />
    </Card>
  );
};

export default DashboardTable;
