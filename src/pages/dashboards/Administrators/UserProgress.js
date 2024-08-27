import React from "react";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material/styles";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { DataGrid, esES } from "@mui/x-data-grid";

const UserProgress = ({ open, close, progress }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();
  const ProgressDiv = styled("div")({
    width: "100%",
    border: "1px solid rgba(140, 140, 140, 0.5)",
    height: "26px",
    overflow: "hidden",
    position: "relative",
    borderRadius: "2px",
  });

  const ProgressContainer = styled("div")({
    width: "100%",
    display: "flex",
    position: "absolute",
    lineHeight: "24px",
    justifyContent: "center",
    color: theme.palette.mode === "light" ? "black" : "white",
  });

  const columns = [
    {
      field: "name",
      headerName: "Materia",
      width: 250,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
    },
    {
      field: "completed",
      headerName: "status",
      width: 200,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
      renderCell: (params) =>
        params.row.completed === 0 ? "En progreso" : "Completado",
    },
    {
      field: "progress",
      headerName: "Calificación",
      width: 150,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
      renderCell: (params) => {
        const result = ((params.row.grade * 100) / params.row.points).toFixed(
          2
        );
        let color = "";
        if (result < 70) {
          color = "rgb(255, 140, 140, 0.5)";
        } else if (result > 70 && result < 80) {
          color = "rgb(255, 255, 0, 0.5)";
        } else if (result > 80 && result <= 100) {
          color = "rgb(140, 255, 140, 0.5)";
        }
        return params.row.grade !== null || params.row.points ? (
          <ProgressDiv>
            <ProgressContainer>{result}%</ProgressContainer>
            <div
              style={{
                height: "100%",
                maxWidth: `${result}%`,
                backgroundColor: color,
                background: color,
              }}
            />
          </ProgressDiv>
        ) : (
          "Sin datos"
        );
      },
    },
  ];
  return (
    <Dialog open={open} fullWidth maxWidth="lg" onClose={close}>
      <DialogTitle>Progreso del usuario</DialogTitle>
      <div style={{ height: 360, width: "100%" }}>
        <DataGrid
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          pageSizeOptions={[5, 10, 25]}
          rows={progress ?? []}
          rowHeight={40}
          columns={columns}
        />
      </div>
      <DialogActions>
        <Button onClick={close}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProgress;
