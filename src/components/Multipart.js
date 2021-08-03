import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Modal from "@material-ui/core/Modal";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PublishIcon from "@material-ui/icons/Publish";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  select_root: {
    paddingBottom: "2px",
  },
  select_icon: {
    right: "16%",
    top: "16%",
  },
  modal_body: {
    position: "relative",
    width: "40%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "30%",
    left: "30%",
  },
}));

function Multipart(props) {
  const classes = useStyles();
  const [open, set_open] = useState(false);
  const [file_ref, set_file_ref] = useState([null]);

  const param_type_change = (e, i, param_type) => {
    if (
      i !== undefined &&
      param_type !== undefined &&
      param_type !== "backdropClick"
    )
      props.handler(null, i, null, "param_type", param_type);

    if (param_type !== "file" && file_ref[i]) {
      // changing from file upload to other file types
      let cur_file_ref = file_ref;
      cur_file_ref[i] = null;
      set_file_ref(cur_file_ref);
      props.handler({ target: { value: null } }, i, "value", "change");
    } else if (param_type !== "file" && !file_ref[i]) {
      // changing between text and multiline
      let cur_value = props.state[i].value;
      if (param_type === "multiline" && cur_value)
        props.handler(
          { target: { value: cur_value.replaceAll("\n", "") } },
          i,
          "value",
          "change",
        );
      else
        props.handler({ target: { value: cur_value } }, i, "value", "change");
    } else {
      // changing to file
      let cur_file_ref = file_ref;
      cur_file_ref[i] = React.createRef();
      set_file_ref(cur_file_ref);
      props.handler({ target: { value: null } }, i, "value", "change");
    }
  };

  const get_param = (i, p_value) => {
    switch (props.state[i]["type"]) {
      case "text":
        return (
          <TextField
            label="Value"
            id={"multipart_value_" + i}
            value={p_value}
            onChange={(e) => {
              props.handler(e, i, "value", "change");
            }}
            fullWidth
          />
        );
      case "multiline":
        const byteSize = (str) => new Blob([str]).size;
        let name_number = i + 1;
        let edit_text = p_value ? byteSize(p_value) + " bytes" : "Edit";
        return (
          <Grid container item>
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              fullWidth
              style={{ marginTop: "7px" }}
              onClick={() => {
                set_open(true);
              }}
              endIcon={<EditIcon />}
            >
              {edit_text}
            </Button>
            <Modal
              open={open}
              onClose={() => {
                set_open(false);
              }}
            >
              <div className={classes.modal_body}>
                <TextField
                  label={
                    "Value of name " +
                    name_number +
                    ": " +
                    props.state[i]["name"]
                  }
                  fullWidth
                  multiline
                  minRows={8}
                  maxRows={16}
                  value={p_value}
                  onChange={(e) => {
                    props.handler(e, i, "value", "change");
                  }}
                />
              </div>
            </Modal>
          </Grid>
        );
      case "file":
        return (
          <Grid container item>
            <input
              accept="*/*"
              id={"multipart_upload_" + i}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                props.handler(
                  { target: { value: e.target.files[0] } },
                  i,
                  "value",
                  "change",
                );
              }}
              ref={file_ref[i]}
            />
            <label htmlFor={"multipart_upload_" + i} style={{ width: "100%" }}>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                style={{ marginTop: "7px", width: "100%" }}
                endIcon={<PublishIcon />}
                component="span"
              >
                {file_ref[i].current &&
                file_ref[i].current.files &&
                file_ref[i].current.files[0]
                  ? file_ref[i].current.files[0].name.length < 15
                    ? file_ref[i].current.files[0].name
                    : file_ref[i].current.files[0].name.substring(0, 15) + "..."
                  : "Upload"}
              </Button>
            </label>
          </Grid>
        );
      default:
        break;
    }
  };

  let name_value_jsx = props.state.map((obj, i) => {
    return (
      <Grid
        container
        item
        xs={12}
        justifyContent="space-evenly"
        key={i}
        spacing={1}
      >
        <Grid item xs={5}>
          <TextField
            label="Name"
            id={"multipart_name_" + i}
            value={obj.name}
            onChange={(e) => {
              props.handler(e, i, "name", "change");
            }}
          />
        </Grid>
        <Grid
          container
          item
          xs={5}
          alignContent={obj["type"] !== "text" ? "center" : ""}
        >
          {get_param(i, obj.value)}
        </Grid>
        <Grid
          container
          item
          xs={1}
          alignContent={obj["type"] !== "text" ? "center" : "center"}
          style={{ marginTop: "10px" }}
        >
          <FormControl>
            <Select
              id={i + "param_type"}
              value=""
              classes={{ root: classes.select_root, icon: classes.select_icon }}
            >
              <MenuItem
                onClick={(e) => {
                  param_type_change(e, i, "text");
                }}
              >
                Text
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  param_type_change(e, i, "multiline");
                }}
              >
                Multiline
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  param_type_change(e, i, "file");
                }}
              >
                File
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <IconButton
            aria-label="delete"
            style={{ marginTop: "10px" }}
            onClick={(e) => {
              props.handler(e, i, null, "delete");
              let cur_file_ref = file_ref;
              cur_file_ref.splice(i, 1);
              set_file_ref(cur_file_ref);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    );
  });

  return (
    <React.Fragment>
      {name_value_jsx}
      <Grid container item xs={12} justifyContent="center" key="add_button">
        <IconButton
          aria-label="add"
          style={{ marginTop: "10px" }}
          onClick={(e) => {
            props.handler(e, null, null, "add");
            let cur_file_ref = file_ref;
            cur_file_ref.push(null);
            set_file_ref(cur_file_ref);
          }}
        >
          <AddIcon />
        </IconButton>
      </Grid>
    </React.Fragment>
  );
}

export default Multipart;
