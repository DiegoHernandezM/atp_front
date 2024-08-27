import { isString } from "lodash";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
// material
import { alpha, styled } from "@mui/material/styles";
import { Paper, Box, Typography, Button } from "@mui/material";
// utils
import { fData } from "./utils/formatNumber";
//
import { UploadIllustration } from "../assets";

// ----------------------------------------------------------------------

const DropZoneStyle = styled("div")(({ theme }) => ({
  outline: "none",
  display: "flex",
  overflow: "hidden",
  textAlign: "center",
  position: "relative",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(5, 0),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create("padding"),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  "&:hover": {
    opacity: 0.72,
    cursor: "pointer",
  },
  [theme.breakpoints.up("md")]: { textAlign: "left", flexDirection: "row" },
}));

// ----------------------------------------------------------------------

UploadSingleFile.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  requirements: PropTypes.string,
  sx: PropTypes.object,
};

export function UploadSingleFile({ error, file, sx, requirements, ...other }) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    ...other,
  });

  const ShowRejectionItems = () => (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: "error.light",
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = file;
        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {fData(size)}
            </Typography>
            {errors.map((e) => (
              <Typography key={e.code} variant="caption" component="p">
                - {e.message}
              </Typography>
            ))}
          </Box>
        );
      })}
    </Paper>
  );

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: "error.main",
            borderColor: "error.light",
            bgcolor: "error.lighter",
          }),
          ...(file && { padding: "12% 0" }),
        }}
      >
        <input {...getInputProps()} />

        <UploadIllustration sx={{ width: 220 }} />

        <Box sx={{ p: 3, ml: { md: 2 } }}>
          <Typography gutterBottom variant="h5">
            Arrastre o seleccione archivo EXCEL
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {requirements}
            <br />
            <br />
            Arrastra aquí tu archivo que deseas cargar ó da click en&nbsp;
            <Typography
              variant="body2"
              component="span"
              sx={{ color: "primary.main", textDecoration: "underline" }}
            >
              buscar
            </Typography>
            &nbsp;en tu equipo.
          </Typography>
        </Box>
        {file && (
          <>
            <Box
              component="img"
              alt={file.path ?? ""}
              src="/excel.jpeg"
              sx={{
                top: 8,
                borderRadius: 1,
                objectFit: "cover",
                position: "absolute",
                width: "calc(100% - 16px)",
                height: "calc(80% - 16px)",
              }}
            />
            <Typography variant="h3" sx={{ zIndex: 999, color: "black" }}>
              {file.path ?? ""}
            </Typography>
          </>
        )}
      </DropZoneStyle>

      {fileRejections.length > 0 && <ShowRejectionItems />}
    </Box>
  );
}
