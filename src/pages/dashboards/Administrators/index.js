import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  getUser,
  getStats,
  getDataBarChart,
  getDataLinearChart
} from "../../../redux/slices/dashboard";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";
import useAuth from "../../../hooks/useAuth";
import BarChart from "./BarChart";
import LinearChart from "./LinearChart";
import Stats from "./Stats";
import Table from "./Table";
import moment from "moment";


const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Dashboard() {
  const dispatch = useDispatch();
  const { users, stats, dataBarChart, dataLinearChart } = useSelector(
    (state) => state.dashboard
  );
  const { t } = useTranslation();
  const { user } = useAuth();
  const name = localStorage.getItem("user");

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getStats());
    dispatch(getDataBarChart());
    dispatch(getDataLinearChart(moment().format("YYYY-MM-DD")));

  }, [dispatch]);

  const handleCallback = (date) =>
    new Promise((resolve) => {
      dispatch(getDataLinearChart(date));
      resolve();
    });

  return (
    <React.Fragment>
      <Helmet title="Dashboard" />
      <Grid justifyContent="space-between" container spacing={6}>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1">
            {t("Bienvenido Capitán:")} {name}
          </Typography>
        </Grid>
      </Grid>
      <Divider my={6} />
      <Grid container spacing={6}>
        <Grid item xs={12} lg={5}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Usuarios"
                amount={stats?.countUsers}
                illustration="/static/img/illustrations/working.png"
                additionalText="&nbsp;"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Administradores"
                amount={stats?.countAdmins}
                illustration="/static/img/illustrations/waiting.png"
                additionalText="&nbsp;"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Materias"
                amount={stats?.countSubjects}
                illustration="/static/img/illustrations/subject.png"
                additionalText="&nbsp;"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Uso AWS"
                amount={stats?.cpuUsage}
                illustration="/static/img/illustrations/checklist.png"
                additionalText="&nbsp;"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={7}>
          <BarChart labels={dataBarChart.labels} info={dataBarChart.info} title="Conteo de repetición de test por materia" label="Repeticiones" />
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12} lg={4}>
          <LinearChart parentCallback={handleCallback} labels={dataLinearChart.labels} info={dataLinearChart.info}  />
        </Grid>
        <Grid item xs={12} lg={8}>
          <Table users={users} getUser={getUser} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Dashboard;
