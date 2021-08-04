import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import CodeIcon from "@material-ui/icons/Code";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TextJson(props) {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <TextField
          label="JSON text"
          fullWidth
          multiline
          minRows={8}
          maxRows={16}
          variant="filled"
          value={props.state.value}
          onChange={(e) => {
            props.handler(e, "change");
          }}
          style={{ marginBottom: "10px" }}
          error={Boolean(props.state.error)}
          helperText={props.state.error}
        />
      </Grid>
      <Snackbar
        open={props.state.snackbar_open}
        autoHideDuration={3000}
        onClose={() => {
          props.handler(null, "close");
        }}
      >
        <Alert
          onClose={() => {
            props.handler(null, "close");
          }}
          severity="error"
        >
          Invalid JSON!
        </Alert>
      </Snackbar>
      <Grid item xs={6} justifyContent="space-evenly">
        <Tooltip title="Beautify" aria-label="beautify">
          <IconButton
            aria-label="beautify"
            onClick={() => {
              props.handler(null, "beautify");
            }}
          >
            <CodeIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}

export default TextJson;
