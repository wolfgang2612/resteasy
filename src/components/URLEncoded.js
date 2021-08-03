import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { FormControl, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

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
    top: "40%",
    left: "30%",
  },
}));

function URLEncoded(props) {
  const classes = useStyles();
  const [open, set_open] = useState(false);

  const param_type_change = (e, i, param_type) => {
    if (
      i !== undefined &&
      param_type !== undefined &&
      param_type !== "backdropClick"
    )
      props.handler(null, i, null, "param_type", param_type);

    // changing between text and multiline
    let cur_value = props.state[i].value;
    if (param_type === "multiline" && cur_value)
      props.handler(
        { target: { value: cur_value.replaceAll("\n", "") } },
        i,
        "value",
        "change",
      );
    else props.handler({ target: { value: cur_value } }, i, "value", "change");
  };

  const get_param = (i, p_value) => {
    switch (props.state[i]["type"]) {
      case "text":
        return (
          <TextField
            label="Value"
            id={"urlencoded_value_" + i}
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
                  rows={8}
                  value={p_value}
                  onChange={(e) => {
                    props.handler(e, i, "value", "change");
                  }}
                />
              </div>
            </Modal>
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
            id={"urlencoded_name_" + i}
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
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <IconButton
            aria-label="delete"
            style={{ marginTop: "10px" }}
            onClick={(e) => {
              props.handler(e, i, null, "delete");
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
          }}
        >
          <AddIcon />
        </IconButton>
      </Grid>
    </React.Fragment>
  );
}

export default URLEncoded;
