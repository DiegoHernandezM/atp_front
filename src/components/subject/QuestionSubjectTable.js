import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Tooltip,
  IconButton,
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, esES } from "@mui/x-data-grid";
import QuickSearch from "../../pages/tables/QuickSearch";
import { red } from '@mui/material/colors';

QuestionSubjectTable.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  subject: PropTypes.object,
  questions: PropTypes.array
};

export default function QuestionSubjectTable({ open, close, questions, subject }) {
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = questions.filter((row) =>
      Object.keys(row).some((field) => searchRegex.test(row[field]))
    );
    setRows(filteredRows);
  };
  function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
  console.log(questions);
  const columns = [
    {
      field: "question",
      headerName: "Pregunta",
      width: 250,
    },
    {
      field: "points",
      headerName: "Puntos",
      width: 50,
    },
    {
      field: "a",
      headerName: "Respuesta A",
      width: 100,
    },
    {
      field: "b",
      headerName: "Respuesta B",
      width: 100,
    },
    {
      field: "c",
      headerName: "Respuesta C",
      width: 100,
    },
    {
      field: "d",
      headerName: "Respuesta D",
      width: 100,
    },
    {
      field: "e",
      headerName: "Respuesta E",
      width: 100,
    },
    {
      field: "answer",
      headerName: "Respuesta",
      width: 100,
    },
    {
      field: "explanation",
      headerName: "Justificación",
      width: 100,
    }
  ];
  return (
    <React.Fragment>
      <Dialog fullWidth={true} maxWidth="xl" open={open} onClose={close}>
        <DialogTitle>Listado de preguntas de: {subject?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A continuación se muestran las preguntas asociada a {subject?.name}
          </DialogContentText>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              components={{
                Toolbar: QuickSearch,
              }}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 50 } },
              }}
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              pageSizeOptions={[50, 100, 200]}
              rows={rows.length > 0 ? rows : questions}
              columns={columns}
              componentsProps={{
                toolbar: {
                  export: true,
                  columns: true,
                  density: true,
                  search: true,
                  customExport: false,
                  value: searchText,
                  onChange: (event) => requestSearch(event.target.value),
                  clearSearch: () => requestSearch(""),
                },
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}