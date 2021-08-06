import React from "react";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

function Headers(props) {
  const [bulk_edit, set_bulk_edit] = React.useState(false);
  const [bulk_value, set_bulk_value] = React.useState("");

  const handle_edit_type_change = (btype) => {
    // it is bulk. convert the value from local state to lifted state
    if (btype) {
      let converted_headers = bulk_value.split("\n");
      converted_headers = converted_headers.map((obj) => {
        let pair = obj.split(":");
        if (pair.length === 2) {
          return {
            name: pair[0].replaceAll(" ", ""),
            value: pair[1].replaceAll(" ", ""),
          };
        } else return { name: "", value: "" };
      });

      if (!converted_headers.length || !bulk_value) converted_headers = [];
      props.handler(null, null, converted_headers, "edit_type");
    } else {
      let bulk_text = "";
      props.state.forEach((obj, i) => {
        bulk_text += obj.name + ": " + obj.value;
        if (i !== props.state.length - 1) bulk_text += "\n";
      });
      set_bulk_value(bulk_text);
    }
  };

  let name_value_jsx = bulk_edit ? (
    <Grid container item xs={12}>
      <TextField
        label="<name>: <value> separated by newline"
        fullWidth
        multiline
        minRows={8}
        maxRows={16}
        variant="filled"
        value={bulk_value}
        onChange={(e) => {
          set_bulk_value(e.target.value);
        }}
        style={{ marginBottom: "10px" }}
      />
    </Grid>
  ) : (
    props.state.map((obj, i) => {
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
              id={"header_name_" + i}
              value={obj.name}
              onChange={(e) => {
                props.handler(e, i, "name", "change");
              }}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              label="Value"
              id={"header_value_" + i}
              value={obj.value}
              onChange={(e) => {
                props.handler(e, i, "value", "change");
              }}
              fullWidth
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
    })
  );

  return (
    <Grid container item xs={12}>
      {name_value_jsx}
      <Grid container item xs={12} justifyContent="center" key="add_button">
        <IconButton
          aria-label="add"
          style={{
            marginTop: "10px",
            display: bulk_edit ? "none" : "inline-flex",
          }}
          onClick={(e) => {
            props.handler(e, null, null, "add");
          }}
        >
          <AddIcon />
        </IconButton>
      </Grid>
      <Grid container item xs={12} justifyContent="flex-end">
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            set_bulk_edit(!bulk_edit);
            handle_edit_type_change(bulk_edit);
          }}
        >
          {bulk_edit ? "Set headers" : "Bulk edit"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default Headers;
