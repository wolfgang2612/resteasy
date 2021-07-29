import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Multipart from "./Multipart";

function Request() {
  const [req_type, set_req_type] = useState("");
  const [req_url, set_req_url] = useState("");
  const [body_type, set_body_type] = useState("multipart");
  const [multipart, set_multipart] = useState([{ name: "", value: "" }]);

  const req_type_change = (e) => {
    set_req_type(e.target.value);
  };

  const req_url_change = (e) => {
    set_req_url(e.target.value);
  };

  const body_type_change = (e) => {
    set_body_type(e.target.value);
  };

  const multipart_handler = (e, i, name_or_value, type) => {
    let cur_multipart = [...multipart];

    switch (type) {
      case "change":
        cur_multipart[i][name_or_value] = e.target.value;
        break;
      case "add":
        cur_multipart.push({ name: "", value: "" });
        break;
      case "delete":
        cur_multipart.splice(i, 1);
        break;
      default:
        break;
    }

    set_multipart(cur_multipart);
  };

  const get_body_jsx = () => {
    let return_body;
    switch (body_type) {
      case "multipart":
        return_body = (
          <Multipart state={multipart} handler={multipart_handler} />
        );
        break;

      default:
        return_body = "under construction";
        break;
    }

    return return_body;
  };

  const handle_submit = () => {
    console.log(multipart);
  };

  return (
    <Grid container item xs={12} justifyContent="space-between" spacing={1}>
      <Grid item xs={12} sm={5} md={4} style={{ marginBottom: "10px" }}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="lbl_req_type">Type</InputLabel>
          <Select
            labelId="lbl_req_type"
            id="req_type"
            value={req_type}
            onChange={req_type_change}
            label="Type"
          >
            <MenuItem value="get">GET</MenuItem>
            <MenuItem value="post">POST</MenuItem>
            <MenuItem value="put">PUT</MenuItem>
            <MenuItem value="delete">DELETE</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={7} md={8} style={{ marginBottom: "10px" }}>
        <TextField
          id="req_url"
          label="URL"
          placeholder="https://your-api.com/route/to/be/tested/"
          variant="outlined"
          fullWidth
          value={req_url}
          onChange={req_url_change}
        />
      </Grid>

      <Grid item xs={12} style={{ marginBottom: "10px" }}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<Icon>send</Icon>}
          fullWidth
          onClick={handle_submit}
        >
          Send
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Body
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth>
              <InputLabel htmlFor="body_type">Body type</InputLabel>
              <Select
                value={body_type}
                id="body_type"
                onChange={body_type_change}
                style={{ marginBottom: "10px" }}
              >
                <ListSubheader>Structured</ListSubheader>
                <MenuItem value="multipart">Multipart form</MenuItem>
                <MenuItem value="urlenc">Form URL encoded</MenuItem>
                <ListSubheader>Text</ListSubheader>
                <MenuItem value="json">JSON</MenuItem>
              </Select>
              {get_body_jsx()}
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
}

export default Request;
