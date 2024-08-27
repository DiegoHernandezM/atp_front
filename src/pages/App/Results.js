import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { getUserTests } from "../../redux/slices/usertests";
import { DataGrid, esES } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "./Navigation";
import moment from "moment";
import { Button } from "@mui/material";

export default function Results() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userTests } = useSelector((state) => state.usertests);
  const theme = useTheme();
  useEffect(() => {
    dispatch(getUserTests());
  }, []);

  const handleSeeTest = (testId) => {
    navigate(`/dashboardapp/test?test_id=${testId}`);
  };

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
      field: "id",
      headerName: "ID",
      width: 50,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
      hide: true,
    },
    {
      field: "created_at",
      headerName: "fecha",
      width: 120,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: "subject_name",
      headerName: "Materia",
      width: 150,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
      valueFormatter: (params) => {
        return params.value ? params.value : "Simulacro";
      },
    },
    {
      field: "progress",
      headerName: "Calificación",
      width: 150,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
      renderCell: (params) => {
        const result = (
          (parseInt(params.row.grade) * 100) /
          parseInt(params.row.points)
        ).toFixed(2);
        let color = "";
        if (result < 70) {
          color = "rgb(255, 140, 140, 0.5)";
        } else if (result > 70 && result < 80) {
          color = "rgb(255, 255, 0, 0.5)";
        } else if (result > 80 && result <= 100) {
          color = "rgb(140, 255, 140, 0.5)";
        }
        return params.value !== null ? (
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
          ""
        );
      },
    },
    {
      field: "total",
      headerName: "Total",
      width: 100,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
      renderCell: (params) => {
        const total = (params.row.grade ?? 0) + " / " + params.row.points;
        return total;
      },
    },
    {
      field: "duration",
      headerName: "Duración",
      width: 100,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
    },
    {
      field: "total2",
      headerName: "Acciones",
      width: 150,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            handleSeeTest(params.row.id);
          }}
        >
          Ver Respuestas
        </Button>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Box sx={{ minWidth: 200 }}>
        <div style={{ height: 720, width: "100%" }}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={userTests ?? []}
            rowHeight={50}
            columns={columns}
          />
          <Navigation />
        </div>
      </Box>
    </React.Fragment>
  );
}
