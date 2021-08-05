import React from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import PublishIcon from "@material-ui/icons/Publish";

function File(props) {
  const [header_change_confirm, set_header_change_confirm] =
    React.useState(false);
  const [file_type, set_file_type] = React.useState(null);

  const file_ref = React.useRef();

  const confirm_open = () => {
    set_header_change_confirm(true);
  };

  const confirm_close = (change) => {
    set_header_change_confirm(false);
    if (change === "yes") {
      props.handler(file_type, "header_change");
    }
  };

  return (
    <Grid container item xs={12} justifyContent="space-around">
      <Grid item xs={5}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            props.handler(null, "value_change");
            file_ref.current.value = null;
          }}
        >
          Reset
        </Button>
      </Grid>
      <Grid item xs={5}>
        <input
          accept="*/*"
          id={"file_upload"}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => {
            props.handler(e.target.files[0], "value_change");
            set_file_type(e.target.files[0].type);
            confirm_open();
          }}
          ref={file_ref}
        />
        <label htmlFor={"file_upload"} style={{ width: "100%" }}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            endIcon={<PublishIcon />}
            component="span"
          >
            {file_ref.current &&
            file_ref.current.files &&
            file_ref.current.files[0]
              ? file_ref.current.files[0].name.length < 15
                ? file_ref.current.files[0].name
                : file_ref.current.files[0].name.substring(0, 15) + "..."
              : "Upload"}
          </Button>
        </label>
      </Grid>
      <Dialog open={header_change_confirm} onClose={confirm_close}>
        <DialogTitle>{"Change header?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Change header to {file_type} ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              confirm_close("no");
            }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              confirm_close("yes");
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default File;
