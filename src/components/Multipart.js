import React from "react";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { FormControl, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  icon: {
    right: "14%",
    top: "16%",
  },
  root: {
    "&:focus": {
      backgroundColor: "rgba(255, 255, 255, 0)",
      borderRadius: "100%",
    },
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.06)",
      borderRadius: "100%",
    },
    padding: "12px",
  },
}));

function Multipart(props) {
  const classes = useStyles();

  const param_type_change = (e, i, param_type) => {
    e.preventDefault();

    console.log(i);
    console.log(param_type);
    if (
      i !== undefined &&
      param_type !== undefined &&
      param_type !== "backdropClick"
    )
      props.handler(null, i, null, "param_type", param_type);
  };

  const get_param = (i, p_value) => {
    switch (props.state[i]["type"]) {
      case "text":
        return (
          <TextField
            label="Value"
            id={"multi_value_" + i}
            value={p_value}
            onChange={(e) => {
              props.handler(e, i, "value", "change");
            }}
            fullWidth
          />
        );
      case "multiline":
        return (
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            fullWidth
            style={{ marginTop: "10px" }}
          >
            Edit
          </Button>
        );
      case "file":
        return "wait2";
      default:
        break;
    }
  };

  let name_value_jsx = props.state.map((obj, i) => {
    return (
      <Grid container item xs={12} justifyContent="space-evenly" key={i}>
        <Grid item xs={5}>
          <TextField
            label="Name"
            id={"multi_name_" + i}
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
          style={{ marginTop: "10px", paddingLeft: "10px" }}
        >
          <FormControl>
            <Select
              id={i + "param_type"}
              value=""
              disableUnderline
              classes={classes}
              IconComponent={MoreVertIcon}
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
            }}
            onMouseOver={(e) => {
              console.log(e.target.style);
            }}
          >
            <DeleteIcon
              onMouseOver={(e) => {
                console.log(e.target.style);
              }}
            />
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

export default Multipart;
