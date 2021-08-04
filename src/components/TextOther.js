import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

function TextJson(props) {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <TextField
          label="Text"
          fullWidth
          multiline
          minRows={8}
          maxRows={16}
          variant="filled"
          value={props.state.value}
          onChange={(e) => {
            props.handler(e);
          }}
          style={{ marginBottom: "10px" }}
        />
      </Grid>
    </Grid>
  );
}

export default TextJson;
