import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SendIcon from "@material-ui/icons/Send";

import FormData from "form-data";
import qs from "qs";

import Multipart from "./Multipart";
import URLEncoded from "./URLEncoded";
import TextJson from "./TextJson";

function Request(props) {
  const [req_type, set_req_type] = useState("");
  const [req_url, set_req_url] = useState("");
  const [body_type, set_body_type] = useState("multipart");
  const [body_type_limbo, set_body_type_limbo] = useState(null);
  const [multipart, set_multipart] = useState([
    { name: "", value: "", type: "text" },
  ]);
  const [urlencoded, set_urlencoded] = useState([
    { name: "", value: "", type: "text" },
  ]);
  const [textjson, set_textjson] = useState({
    value: '{"id": "12"}',
    error: null,
    snackbar_open: false,
  });
  const [parse_timeout, set_parse_timeout] = useState(null);
  const [body_type_change_confirm, set_body_type_change_confirm] =
    React.useState(false);

  const req_type_change = (e) => {
    set_req_type(e.target.value);
  };

  const req_url_change = (e) => {
    set_req_url(e.target.value);
  };

  const body_type_change = (e) => {
    if (e.target.value) {
      set_body_type_limbo(e.target.value);
      confirm_open();
    }
  };

  const confirm_open = () => {
    set_body_type_change_confirm(true);
  };

  const confirm_close = (change) => {
    set_body_type_change_confirm(false);
    if (change === "yes") {
      set_body_type(body_type_limbo);
    }
  };

  const multipart_handler = (e, i, name_or_value, action_type, param_type) => {
    let cur_multipart = [...multipart];

    switch (action_type) {
      case "change":
        cur_multipart[i][name_or_value] = e.target.value;
        break;
      case "add":
        cur_multipart.push({ name: "", value: "", type: "text" });
        break;
      case "delete":
        cur_multipart.splice(i, 1);
        break;
      case "param_type":
        cur_multipart[i]["type"] = param_type;
        break;
      default:
        break;
    }

    set_multipart(cur_multipart);
  };

  const urlencoded_handler = (e, i, name_or_value, type, param_type) => {
    let cur_urlencoded = [...urlencoded];

    switch (type) {
      case "change":
        cur_urlencoded[i][name_or_value] = e.target.value;
        break;
      case "add":
        cur_urlencoded.push({ name: "", value: "", type: "text" });
        break;
      case "delete":
        cur_urlencoded.splice(i, 1);
        break;
      case "param_type":
        cur_urlencoded[i]["type"] = param_type;
        break;
      default:
        break;
    }

    set_urlencoded(cur_urlencoded);
  };

  const textjson_handler = (e, type) => {
    switch (type) {
      case "change":
        if (parse_timeout) clearTimeout(parse_timeout);
        set_textjson({ value: e.target.value, error: null });
        let new_parse_timeout = setTimeout(() => {
          try {
            JSON.parse(e.target.value);
          } catch (error) {
            set_textjson({
              value: e.target.value,
              error: error.message,
            });
          }
        }, 1500);
        set_parse_timeout(new_parse_timeout);
        break;

      case "beautify":
        if (textjson.error) {
          set_textjson({ ...textjson, snackbar_open: true });
        } else {
          let beautified_text = JSON.stringify(
            JSON.parse(textjson.value),
            null,
            "\t",
          );
          set_textjson({ ...textjson, value: beautified_text });
        }
        break;
      case "close":
        set_textjson({ ...textjson, snackbar_open: false });
        break;
      default:
        break;
    }
  };

  const get_body_jsx = () => {
    let return_body = [];
    switch (body_type) {
      case "multipart":
        return_body.push(
          <Multipart state={multipart} handler={multipart_handler} />,
        );
        break;

      case "urlencoded":
        return_body.push(
          <URLEncoded state={urlencoded} handler={urlencoded_handler} />,
        );
        break;

      case "json":
        return_body.push(
          <TextJson state={textjson} handler={textjson_handler} />,
        );
        break;

      default:
        return_body.push("under construction");
        break;
    }

    return_body.push(
      <Dialog open={body_type_change_confirm} onClose={confirm_close}>
        <DialogTitle>{"Change body type?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Changing the body type might result in loss of some input data. (For
            example, if any file uploads have been done, they will be reset and
            need to be reuploaded.)
          </DialogContentText>
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
      </Dialog>,
    );
    return return_body;
  };

  const handle_submit = () => {
    let req_config = {};
    req_config["method"] = req_type;
    req_config["url"] = req_url;

    var req_data;

    switch (body_type) {
      case "multipart":
        req_config["headers"] = { "Content-Type": "multipart/form-data" };

        req_data = new FormData();
        multipart.forEach((element) => {
          req_data.append(element.name, element.value);
        });
        break;

      case "urlencoded":
        req_config["headers"] = {
          "Content-Type": "application/x-www-form-urlencoded",
        };

        let urlencoded_object = {};
        urlencoded.forEach((obj) => {
          urlencoded_object[obj["name"]] = obj["value"];
        });
        req_data = qs.stringify(urlencoded_object);
        break;

      case "json":
        req_config["headers"] = {
          "Content-Type": "application/json",
        };
        req_data = textjson.value;
        break;

      default:
        break;
    }

    req_config["data"] = req_data;

    props.handler(req_config);
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
          endIcon={<SendIcon />}
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
                <ListSubheader
                  color="primary"
                  component="span"
                  style={{ pointerEvents: "none" }}
                >
                  Structured
                </ListSubheader>
                <MenuItem value="multipart">Multipart form</MenuItem>
                <MenuItem value="urlencoded">Form URL encoded</MenuItem>
                <Divider />
                <ListSubheader
                  color="primary"
                  component="span"
                  style={{ pointerEvents: "none" }}
                >
                  Text
                </ListSubheader>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <Divider />
                <ListSubheader
                  color="primary"
                  component="span"
                  style={{ pointerEvents: "none" }}
                >
                  Other
                </ListSubheader>
                <MenuItem value="file">File</MenuItem>
                <MenuItem value="nobody">No body</MenuItem>
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
