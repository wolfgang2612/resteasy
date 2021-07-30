import React from "react";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

function URLEncoded(props) {
  let name_value_jsx = props.state.map((obj, i) => {
    return (
      <Grid container item xs={12} justifyContent="space-evenly" key={i}>
        <Grid item xs={5}>
          <TextField
            label="Name"
            id={"urlenc_name_" + i}
            value={obj.name}
            onChange={(e) => {
              props.handler(e, i, "name", "change");
            }}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            label="Value"
            id={"urlenc_value_" + i}
            value={obj.value}
            onChange={(e) => {
              props.handler(e, i, "value", "change");
            }}
          />
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
