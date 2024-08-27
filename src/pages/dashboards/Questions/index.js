import React, { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  getQuestionsCatalogue,
  massLoad,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestion,
  resetQuestion,
} from "../../../redux/slices/questions";
import { getSubjects } from "../../../redux/slices/subjects";
import { UploadSingleFile } from "../../../components/UploadSingleFile";
import DialogConfirm from "../../components/general/DialogConfirm";
import QuickSearch from "../../tables/QuickSearch";
import {
  Box,
  Button,
  CardHeader,
  Drawer,
  FormControl,
  IconButton,
  Link,
  MenuItem,
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Paper as MuiPaper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, esES } from "@mui/x-data-grid";
import { spacing } from "@mui/system";
import { Close } from "@mui/icons-material";
import Page from "../../components/Page";
import { reset } from "numeral";

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);

const validationSchema = yup.object({
  question: yup.string("Pregunta").required("La pregunta es requerida"),
  points: yup.number("Puntos").required("Los puntos son requeridos"),
  a: yup.string("Respuesta A").required("La respuesta A es requerida"),
  b: yup.string("Respuesta B").required("La respuesta B es requerida"),
  c: yup.string("Respuesta C").required("La respuesta C es requerida"),
  answer: yup.string("Respuesta").required("La respuesta es requerida"),
});

function QuestionsContent({ open }) {
  const dispatch = useDispatch();
  const { questionsCatalogue } = useSelector((state) => state.questions);
  const [questionId, setQuestionId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [rows, setRows] = useState([]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = questionsCatalogue.filter((row) =>
      Object.keys(row).some((field) => searchRegex.test(row[field]))
    );
    setRows(filteredRows);
  };
  function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "subject",
      headerName: "Materia",
      width: 120,
    },
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
          setOpenConfirm(true);
          setQuestionId(params.row.id);
        };
        return (
          <>
            <Tooltip key={`re-${params.row.id}`} title="Eliminar">
              <div>
                <IconButton
                  onClick={onClickDelete}
                  key={`re-${params.row.id}`}
                  type="button"
                  color="primary"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleCloseAccept = () => {
    dispatch(deleteQuestion(questionId)).then(() => {
      dispatch(getQuestionsCatalogue());
      setOpenConfirm(false);
    });
  };

  useEffect(() => {
    dispatch(getQuestionsCatalogue());
  }, []);

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Typography variant="body2" gutterBottom>
          Esta es la lista de preguntas que se muestran en la sección de
          cuestionarios, puedes editarlas o eliminarlas.
        </Typography>
      </CardContent>
      <Paper>
        <div style={{ height: 400, width: "1100px" }}>
          <DataGrid
            width="100%"
            components={{
              Toolbar: QuickSearch,
            }}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 50 } },
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            onRowDoubleClick={(row) => {
              dispatch(getQuestion(row.id)).then(() => {
                open();
              });
            }}
            pageSizeOptions={[50, 100, 200]}
            rows={rows.length > 0 ? rows : questionsCatalogue}
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
      </Paper>
      <DialogConfirm
        open={openConfirm}
        close={handleCloseConfirm}
        title="Eliminar pregunta"
        body="¿Desea eliminar esta pregunta?"
        agree={handleCloseAccept}
      />
    </Card>
  );
}

function QuestionForm({ open, close }) {
  const dispatch = useDispatch();
  const { questionData } = useSelector((state) => state.questions);
  const { allSubjects } = useSelector((state) => state.subjects);
  const formik = useFormik({
    initialValues: {
      id: "",
      subject_id: "",
      question: "",
      points: "",
      a: "",
      b: "",
      c: "",
      d: "",
      e: "",
      answer: "",
      explanation: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (questionData.id) {
        dispatch(updateQuestion(questionData.id, values)).then(() => {
          resetForm();
          close();
          dispatch(getQuestionsCatalogue());
        });
      } else {
        dispatch(createQuestion(values)).then(() => {
          resetForm();
          close();
          dispatch(getQuestionsCatalogue());
        });
      }
    },
  });

  useEffect(() => {
    dispatch(getSubjects(false));
  }, []);

  useEffect(() => {
    formik.setFieldValue("id", questionData.subject_id);
    formik.setFieldValue("subject_id", questionData.subject_id);
    formik.setFieldValue("question", questionData.question);
    formik.setFieldValue("points", questionData.points);
    formik.setFieldValue("a", questionData.a);
    formik.setFieldValue("b", questionData.b);
    formik.setFieldValue("c", questionData.c);
    formik.setFieldValue("d", questionData.d);
    formik.setFieldValue("e", questionData.e);
    formik.setFieldValue("answer", questionData.answer);
    formik.setFieldValue("explanation", questionData.explanation);
  }, [questionData]);
  return (
    <Drawer anchor="right" open={open} onClose={close}>
      <Box
        sx={{ width: { xs: "375px", md: "500px", lg: "500px", xl: "1000px" } }}
      >
        <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h4"
              style={{
                marginTop: "10px",
                marginLeft: "10px",
                marginBottom: "30px",
              }}
            >
              {questionData.id ? "Actualizar" : "Nueva"}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{
                borderRadius: 30,
                height: "30px",
                marginTop: "20px",
                marginRight: "10px",
              }}
              size="small"
            >
              {questionData.id ? "Actualizar pregunta" : "Guardar pregunta"}
            </Button>
            <IconButton
              aria-label="close"
              onClick={close}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
              style={{
                marginTop: "10px",
                marginLeft: "10px",
                marginBottom: "30px",
              }}
            >
              <Close />
            </IconButton>
          </Box>
          <FormControl style={{ marginLeft: "10px", width: "90%" }}>
            <TextField
              id="subject"
              name="subject"
              label="Materia"
              onChange={(e, value) => {
                formik.setFieldValue("subject_id", value.props.value);
              }}
              value={formik.values.subject_id || ""}
              error={
                formik.touched.subject_id && Boolean(formik.errors.subject_id)
              }
              helperText={formik.touched.subject_id && formik.errors.subject_id}
              select
              fullWidth
              size="small"
            >
              {allSubjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl
            style={{ marginLeft: "10px", width: "90%", marginTop: "15px" }}
          >
            <TextField
              id="question"
              name="question"
              label="Pregunta"
              value={formik.values.question || ""}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              size="small"
            />
          </FormControl>
          <FormControl
            style={{ marginLeft: "10px", width: "90%", marginTop: "15px" }}
          >
            <TextField
              type="number"
              min="1"
              max="10"
              id="points"
              name="points"
              label="Puntos"
              value={formik.values.points || ""}
              onChange={formik.handleChange}
              error={formik.touched.points && Boolean(formik.errors.points)}
              fullWidth
              helperText={formik.touched.points && formik.errors.points}
              size="small"
            />
          </FormControl>
          <FormControl
            style={{ marginLeft: "10px", width: "90%", marginTop: "15px" }}
          >
            <TextField
              id="a"
              name="a"
              label="Respuesta A"
              value={formik.values.a || ""}
              onChange={formik.handleChange}
              error={formik.touched.a && Boolean(formik.errors.a)}
              fullWidth
              helperText={formik.touched.a && formik.errors.a}
              size="small"
            />
          </FormControl>
          <FormControl
            style={{ marginLeft: "10px", width: "90%", marginTop: "15px" }}
          >
            <TextField
              id="b"
              name="b"
              label="Respuesta B"
              value={formik.values.b || ""}
              onChange={formik.handleChange}
              error={formik.touched.b && Boolean(formik.errors.b)}
              fullWidth
              helperText={formik.touched.b && formik.errors.b}
              size="small"
            />
          </FormControl>
          <FormControl
            style={{ marginLeft: "10px", width: "90%", marginTop: "15px" }}
          >
            <TextField
              id="c"
              name="c"
              label="Respuesta C"
              value={formik.values.c || ""}
              onChange={formik.handleChange}
              error={formik.touched.c && Boolean(formik.errors.c)}
              fullWidth
              helperText={formik.touched.c && formik.errors.c}
              size="small"
            />
          </FormControl>
          <FormControl
            style={{ marginLeft: "10px", width: "90%", marginTop: "15px" }}
          >
            <TextField
              id="d"
              name="d"
              label="Respuesta D"
              value={formik.values.d || ""}
              onChange={formik.handleChange}
              error={formik.touched.d && Boolean(formik.errors.d)}
              fullWidth
              helperText={formik.touched.d && formik.errors.d}
              size="small"
            />
          </FormControl>
          <FormControl
            style={{ marginLeft: "10px", width: "90%", marginTop: "15px" }}
          >
            <TextField
              id="e"
              name="e"
              label="Respuesta E"
              value={formik.values.e || ""}
              onChange={formik.handleChange}
              error={formik.touched.e && Boolean(formik.errors.e)}
              fullWidth
              helperText={formik.touched.e && formik.errors.e}
              size="small"
            />
          </FormControl>
          <FormControl
            style={{ marginLeft: "10px", width: "90%", marginTop: "15px" }}
          >
            <TextField
              id="answer"
              name="answer"
              label="Respuesta Correcta"
              onChange={(e, value) => {
                formik.setFieldValue("answer", value.props.value);
              }}
              value={formik.values.answer || ""}
              error={formik.touched.answer && Boolean(formik.errors.answer)}
              helperText={formik.touched.answer && formik.errors.answer}
              select
              fullWidth
              size="small"
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="D">D</MenuItem>
              <MenuItem value="E">E</MenuItem>
            </TextField>
          </FormControl>
          <FormControl
            style={{ marginLeft: "10px", width: "90%", marginTop: "15px" }}
          >
            <TextField
              id="explanation"
              name="explanation"
              label="Justificación"
              value={formik.values.explanation || ""}
              onChange={formik.handleChange}
              error={
                formik.touched.explanation && Boolean(formik.errors.explanation)
              }
              fullWidth
              helperText={
                formik.touched.explanation && formik.errors.explanation
              }
              size="small"
            />
          </FormControl>
        </form>
      </Box>
    </Drawer>
  );
}

function QuestionsPage() {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const filex = acceptedFiles[0];
    if (filex) {
      setFile(filex);
    }
  }, []);
  useEffect(() => {
    if (file) {
      dispatch(massLoad(file)).then(() => {
        setFile(null);
        dispatch(getQuestionsCatalogue());
      });
    }
  }, [file]);

  const handleOpen = () => {
    setOpen(true);
  };

  const newQuestion = () => {
    dispatch(resetQuestion()).then(() => {
      setOpen(true);
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Page title="Questions">
      <QuestionForm open={open} close={handleClose} />
      <Typography variant="h3" gutterBottom display="inline">
        Lista de Preguntas
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/">
          Dashboard
        </Link>
        <Typography>Preguntas</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Button
        variant="contained"
        sx={{ marginBottom: "10px" }}
        onClick={newQuestion}
      >
        Nueva pregunta
      </Button>
      <QuestionsContent open={handleOpen} />
      <Card sx={{ marginTop: "20px" }}>
        <CardHeader title="Cargar desde plantilla..." />
        <CardContent>
          <UploadSingleFile
            file={file}
            onDrop={handleDropSingleFile}
            requirements="Recuerda que debes incluir en los nombres de las columnas ID, MATERIA/CATEGORIA, PUNTOS, PREGUNTA, RESPUESTA, ANSWER A, ANSWER B, ANSWER C y JUSTIFICACION en la primer hoja"
          />
        </CardContent>
      </Card>
    </Page>
  );
}

export default QuestionsPage;
