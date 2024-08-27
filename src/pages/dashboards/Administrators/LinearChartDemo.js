import React from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { Line } from "react-chartjs-2";
import { MoreVertical } from "react-feather";
import CalendarFilter from "../../../components/general/CalendarFilter";

import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader,
  IconButton,
} from "@mui/material";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)};
  }
`;

const ChartWrapper = styled.div`
  height: 294px;
  width: 100%;
`;

const LinearChartDemo = ({ theme, labels, info }) => {
  const firstDatasetColor = theme.palette.secondary.main;

  const data = {
    labels: labels ?? [],
    datasets: [
      {
        label: "Monto $$",
        backgroundColor: firstDatasetColor,
        borderColor: firstDatasetColor,
        hoverBackgroundColor: firstDatasetColor,
        hoverBorderColor: firstDatasetColor,
        data: info ?? [],
        barPercentage: 0.4,
        categoryPercentage: 0.5,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        stacked: true,
      },

      x: {
        stacked: true,
        grid: {
          color: "transparent",
        },
      },
    },
  };

  return (
    <Card mb={6}>
      <CardContent>
        <ChartWrapper>
          <Line data={data} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
};

export default withTheme(LinearChartDemo);
