import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";

import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
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
  const [open_modal, set_open_modal] = useState(false);

  // this is used for param_type change menu
  const [param_type_anchor_elem, set_param_type_anchor_elem] =
    React.useState(null);
  const [param_type_open_elem, set_param_type_open_elem] = React.useState(null);

  const param_type_open = (e, i) => {
    set_param_type_anchor_elem(e.currentTarget);
    set_param_type_open_elem(i);
  };

  const param_type_close = () => {
    set_param_type_anchor_elem(null);
    set_param_type_open_elem(null);
  };

  const param_type_change = (i, param_type) => {
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
                set_open_modal(true);
              }}
              endIcon={<EditIcon />}
            >
              {edit_text}
            </Button>
            <Modal
              open={open_modal}
              onClose={() => {
                set_open_modal(false);
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
          <IconButton
            onClick={(e) => {
              param_type_open(e, i);
            }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={param_type_anchor_elem}
            keepMounted
            open={param_type_open_elem === i}
            onClose={param_type_close}
          >
            <MenuItem
              onClick={() => {
                param_type_close();
                param_type_change(i, "text");
              }}
            >
              Text
            </MenuItem>
            <MenuItem
              onClick={() => {
                param_type_close();
                param_type_change(i, "multiline");
              }}
            >
              Multiline
            </MenuItem>
          </Menu>
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
