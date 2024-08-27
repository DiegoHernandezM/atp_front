import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

import {
  Breadcrumbs,
  Button,
  Card,
  Divider as MuiDivider,
  Grid,
  Link,
  Tooltip,
  Typography,
  Box,
  Tab,
  Dialog,
  DialogActions,
  DialogContentText,
  TextField,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { spacing } from "@mui/system";
import { DataGrid, esES } from "@mui/x-data-grid";
import { Add as AddIcon } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  clearDataUser,
  restoreDeviceUser
} from "../../../redux/slices/users";
import Page from "../../components/Page";
import UserForm from "../../../../src/components/user/UserForm";
import SnackAlert from "../../components/general/SnackAlert";
import DialogConfirm from "../../components/general/DialogConfirm";
import QuickSearch from "../../tables/QuickSearch";
import {DatePicker} from "@mui/x-date-pickers";
import moment from "moment/moment";

const filters = {
  pinter: {
    cursor: "pointer",
    marginLeft: "5px",
    textAlign: "center",
  },
};

const Divider = styled(MuiDivider)(spacing);

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const useStyles = makeStyles((theme) => ({
  datePicker: {
    width: '100%',
    marginTop: '15px'
  },
}));

function Users() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { users, user, loading } = useSelector((state) => state.users);
  const [openForm, setOpenForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState("success");
  const [message, setMessage] = useState("");
  const [modeUpdate, setModeUpdate] = useState(false);
  const [rows, setRows] = useState([]);
  const [userId, setUserId] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [expirationDialog, setOpenExpirationDialog] = useState(false);
  const [modeRestore, setModeRestore] = useState(false);
  const [value, setValue] = useState('1');
  const [valueExpires, setValueExpires] = useState(new Date(moment().subtract(1, "days")));

  const handleChange = (e, newValue) => {
    dispatch(getUsers(newValue === '1' ? false : true));
    setValue(newValue);
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
      field: "email",
      headerName: "Email",
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
    {
      field: "expires_at",
      headerName: "Expira",
      width: 180,
      renderHeader: (p) => (
        <strong style={{ overflow: "visible" }}>{p.colDef.headerName}</strong>
      ),
      renderCell: (params) => {
        if (params.row.expires_at === null) {
          return params.row.payments?.length > 0 ? params.row.payments[0].create_time : "Sin dato";
        } else {
          return params.row.expires_at;
        }
      }
        
    },
    {
      field: "action",
      headerName: "Acciones",
      sortable: false,
      disableExport: true,
      width: 90,
      renderCell: (params) => {
        const onClickDelete = (e) => {
          e.stopPropagation();
          setUserId(params.row.id);
          setOpenConfirm(true);
          setModeRestore(false);
        };
        const onClickRestore = (e) => {
          e.stopPropagation();
          setUserId(params.row.id);
          setOpenConfirm(true);
          setModeRestore(true);
        };
        return (
          <>
            <Tooltip key={`re-${params.row.id}`} title="Eliminar">
              <div>
                <IconButton
                  disabled={params.row.deleted_at !== null}
                  onClick={onClickDelete}
                  key={`re-${params.row.id}`}
                  type="button"
                  color="primary"
                  style={filters.pinter}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip key={`res-${params.row.id}`} title="Recuperar">
              <div>
                <IconButton
                  disabled={params.row.deleted_at === null}
                  color="primary"
                  onClick={onClickRestore}
                  key={`re-${params.row.id}`}
                  type="button"
                  style={filters.pinter}
                >
                  <RestoreFromTrashIcon />
                </IconButton>
              </div>
            </Tooltip>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(getUsers(false));
  }, [dispatch]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = users.filter((row) =>
      Object.keys(row).some((field) => searchRegex.test(row[field]))
    );
    setRows(filteredRows);
  };

  const handleCloseForm = () => {
    dispatch(clearDataUser());
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setModeUpdate(false);
    setOpenForm(true);
  };

  const handleUpdate = (id, values) => {
    setOpenForm(false);
    dispatch(updateU(id, values));
  };

  const handleCloseConfirm = () => {
    if (modeRestore === false) {
      setModeUpdate(false);
      setOpenConfirm(false);
      setModeRestore(false);
    } else {
      setModeUpdate(false);
      setOpenConfirm(false);
      setModeRestore(true);
    }
  };

  const handleCloseAccept = () => {
    if (modeRestore === false) {
      setOpenConfirm(false);
      dispatch(deleteU());
    } else {
      setOpenConfirm(false);
      setOpenExpirationDialog(true);
    }
  };

  const handleCallbackForm = (values) => {
    dispatch(createU(values));
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const handleReset = (id) => {
    setModeUpdate(false);
    setOpenForm(false);
    dispatch(restoreD(id));
  }

  function createU(values) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(createUser(values)));
      })
        .then((response) => {
          setMessage(
            response.status === 200 ? "Usuario creado" : "Ocurro algun error"
          );
          setTypeMessage(response.status === 200 ? "success" : "error");
          dispatch(getUsers());
          setOpenMessage(true);
          setOpenForm(false);
        })
        .catch((error) => {
          setTypeMessage("error");
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function updateU(id, values) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(updateUser(id, values)));
      })
        .then((response) => {
          dispatch(getUsers());
          setMessage(
            response.status === 200
              ? "Actualizacion realizada"
              : "Ocurrio algun error"
          );
          setTypeMessage(response.status === 200 ? "success" : "error");
          setOpenMessage(true);
        })
        .catch((error) => {
          setTypeMessage("error");
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function deleteU() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(deleteUser(userId)));
      })
        .then((response) => {
          setMessage(
            response.status === 200
              ? "Usuario eliminado"
              : "Ocurrio algun error"
          );
          setTypeMessage(response.status === 200 ? "success" : "error");
          setOpenMessage(true);
          dispatch(getUsers());
          setUserId(0);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function restoreU() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(restoreUser(userId,  moment(valueExpires).format("YYYY-MM-DD"))));
      })
        .then((response) => {
          setMessage(
            response.status === 200
              ? "Usuario recuperado"
              : "Ocurrio algun error"
          );
          setTypeMessage(response.status === 200 ? "success" : "error");
          setOpenMessage(true);
          dispatch(getUsers());
          setUserId(0);
          setModeRestore(false);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function restoreD(id) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(restoreDeviceUser(id)));
      })
        .then((response) => {
          setMessage(
            response.status === 200
              ? "Se han eliminado los dispositivos de usuario"
              : "Ocurrio algun error"
          );
          setTypeMessage(response.status === 200 ? "success" : "error");
          setOpenMessage(true);
          dispatch(getUsers());
        })
        .catch((error) => {
          console.log(error);
        });
  }

  return (
    <React.Fragment>
      <Page title="Usuarios">
        <Grid justifyContent="space-between" container spacing={10}>
          <Grid item>
            <Typography variant="h3" gutterBottom display="inline">
              Usuarios
            </Typography>

            <Breadcrumbs aria-label="Breadcrumb" mt={2}>
              <Link component={NavLink} to="/dashboard">
                Dashboard
              </Link>
              <Typography>Usuarios</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenForm}
              >
                <AddIcon />
                Nuevo usuario
              </Button>
            </div>
          </Grid>
        </Grid>
        <Divider my={6} />
        <SnackAlert
          message={message}
          type={typeMessage}
          open={openMessage}
          close={handleCloseMessage}
        />
        <Card>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }} display="flex" justifyContent="center" alignItems="center">
                <TabList onChange={handleChange}>
                  <Tab label="Activos" value="1" />
                  <Tab label="Inactivos" value="2" />
                </TabList>
              </Box>
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  components={{
                    Toolbar: QuickSearch,
                  }}
                  initialState={{
                    pagination: { paginationModel: { page: 0, pageSize: 10 } },
                  }}
                  localeText={
                    esES.components.MuiDataGrid.defaultProps.localeText
                  }
                  pageSizeOptions={[5, 10, 25]}
                  rows={rows.length > 0 ? rows : users}
                  rowHeight={40}
                  columns={columns}
                  onRowDoubleClick={(params) => {
                    dispatch(getUser(params.row.id));
                    setModeUpdate(true);
                    setOpenForm(true);
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
            </TabContext>
          </Box>
          <UserForm
            open={openForm}
            close={handleCloseForm}
            parentCallback={handleCallbackForm}
            user={user}
            update={modeUpdate}
            updateUser={handleUpdate}
            loading={loading}
            resetDevices={handleReset}
          />
        </Card>
        <DialogConfirm
          open={openConfirm}
          close={handleCloseConfirm}
          title={
            modeRestore === false ? "Eliminar Usuario" : "Recuperar Usuario"
          }
          body={
            modeRestore === false
              ? "Desea eliminar este usuario"
              : "Desea recuperar este usuario"
          }
          agree={handleCloseAccept}
        />
        <Dialog
          open={expirationDialog}
          onClose={() => setOpenExpirationDialog(false)}
          PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setOpenExpirationDialog(false);
              dispatch(restoreU());
            },
          }}
        >
          <DialogTitle>Restaurar usuario</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ingresa la nueva fecha de expiracion para el usuario requerido
            </DialogContentText>
            <DatePicker
              className={classes.datePicker}
              fullWidth
              label="Expira"
              minDate={new Date(moment().subtract(1, "days"))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  margin="dense"
                  fullWidth
                  variant="standard"
                  sx={{ marginTop: '30px' }}
                />
              )}
              id="expires_at"
              name="expires_at"
              value={ valueExpires }
              onChange={(value) => {
                setValueExpires(value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenExpirationDialog(false)}>Cancelar</Button>
            <Button type="submit">Restaurar</Button>
          </DialogActions>
        </Dialog>
      </Page>
    </React.Fragment>
  );
}

export default Users;
