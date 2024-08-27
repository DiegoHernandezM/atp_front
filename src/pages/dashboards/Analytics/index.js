import React from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import { spacing } from "@mui/system";

import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";
import Stats from "./Stats";
import Table from "./Table";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Analytics() {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Helmet title="Dashboard" />
      <Grid justifyContent="space-between" container spacing={6}>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1">
            {t("Bienvenido de vuelta")}
          </Typography>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} lg={5}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Visitors"
                amount="24.532"
                chip="Today"
                percentagetext="+14%"
                percentagecolor={green[500]}
                illustration="/static/img/illustrations/working.png"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Activity"
                amount="63.200"
                chip="Annual"
                percentagetext="-12%"
                percentagecolor={red[500]}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Real-Time"
                amount="1.320"
                chip="Monthly"
                percentagetext="-18%"
                percentagecolor={red[500]}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Bounce"
                amount="12.364"
                chip="Yearly"
                percentagetext="+27%"
                percentagecolor={green[500]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={7}>
          <BarChart />
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12} lg={4}>
          <DoughnutChart />
        </Grid>
          <Grid item xs={12} lg={8}>
          <Table />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Analytics;
