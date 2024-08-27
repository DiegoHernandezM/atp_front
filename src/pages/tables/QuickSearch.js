import * as React from 'react';
import PropTypes from 'prop-types';
import { IconButton, TextField, Typography, Button } from '@mui/material';
import {
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarExport
} from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme();


QuickSearch.propTypes = {
  title: PropTypes.string,
  density: PropTypes.bool,
  export: PropTypes.bool,
  filters: PropTypes.bool,
  columns: PropTypes.bool,
  search: PropTypes.bool,
  customExport: PropTypes.bool,
  clearSearch: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  onClick: PropTypes.func,
  message: PropTypes.string
};



export default function QuickSearch(props) {
  const rootStyles = {
    padding: "10px",
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  };
  return (
    <div sx={rootStyles}>
      <Typography variant="h4" style={{ marginLeft: '10px' }}>
        {props.title}
      </Typography>
      <div>
        {props.filters === true ? <GridToolbarFilterButton /> : null}
        {props.density === true ? <GridToolbarDensitySelector /> : null}
        {props.columns === true ? <GridToolbarColumnsButton /> : null}
        {props.export === true ? <GridToolbarExport /> : null}
        {props.customExport === true ? (
          <Button onClick={props.onClick} variant="text">
            <PrintIcon fontSize="small" style={{ marginRight: '5px' }} />
            {props.message ?? 'exportar'}
          </Button>
        ) : null}
      </div>
      {props.search === true ? (
        <TextField
          variant="standard"
          value={props.value}
          onChange={props.onChange}
          placeholder="Buscar…"
          sx={{ float: "right", marginRight: "5px", marginTop: "-10px" }}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" />,
            endAdornment: (
              <IconButton
                title="Clear"
                aria-label="Clear"
                size="small"
                style={{ visibility: props.value ? 'visible' : 'hidden' }}
                onClick={props.clearSearch}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )
          }}
        />
      ) : null}
    </div>
  );
}
