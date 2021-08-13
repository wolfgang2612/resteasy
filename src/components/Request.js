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
import Chip from "@material-ui/core/Chip";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SendIcon from "@material-ui/icons/Send";

import FormData from "form-data";
import qs from "qs";

import Multipart from "./Multipart";
import URLEncoded from "./URLEncoded";
import TextJson from "./TextJson";
import TextOther from "./TextOther";
import File from "./File";
import Headers from "./Headers";

function Request(props) {
  // STATES
  const [req_type, set_req_type] = useState("");
  const [req_url, set_req_url] = useState("");
  const [body_type, set_body_type] = useState("multipart");
  const [body_type_limbo, set_body_type_limbo] = useState(null);
  const [multipart, set_multipart] = useState([
    { name: "", value: "", type: "text", selected: true },
  ]);
  const [urlencoded, set_urlencoded] = useState([
    { name: "", value: "", type: "text", selected: true },
  ]);
  const [textjson, set_textjson] = useState({
    value: '{"id": "12"}',
    error: null,
    snackbar_open: false,
  });
  const [textother, set_textother] = useState("");
  const [file, set_file] = useState("");
  const [parse_timeout, set_parse_timeout] = useState(null);
  const [body_type_change_confirm, set_body_type_change_confirm] =
    useState(false);
  const [headers, set_headers] = useState([
    { name: "Content-Type", value: "multipart/form-data", selected: true },
  ]);

  // FUNCTIONS
  const req_type_change = (e) => {
    set_req_type(e.target.value);
  };

  const req_url_change = (e) => {
    set_req_url(e.target.value);
  };

  const ctype_change = (body_type, custom) => {
    let ctype_present = false;
    let cur_headers = [...headers];
    let ctype_index;

    cur_headers.forEach((obj, i) => {
      if (obj["name"] === "Content-Type") {
        ctype_present = true;
        ctype_index = i;
      }
    });
    if (!ctype_present) {
      cur_headers.push({ name: "Content-Type", value: "" });
      ctype_index = cur_headers.length - 1;
    }

    switch (body_type) {
      case "multipart":
        cur_headers[ctype_index]["value"] = "multipart/form-data";
        break;
      case "urlencoded":
        cur_headers[ctype_index]["value"] = "application/x-www-form-urlencoded";
        break;
      case "json":
        cur_headers[ctype_index]["value"] = "application/json";
        break;
      case "other":
        cur_headers[ctype_index]["value"] = "text/plain";
        break;
      case "nobody":
        cur_headers.splice(ctype_index, 1);
        break;
      case "custom":
        cur_headers[ctype_index]["value"] = custom;
        break;
      default:
        break;
    }
    set_headers(cur_headers);
  };

  const body_type_change = (e) => {
    if (e.target.value) {
      if (body_type === "multipart" || body_type === "file") {
        set_body_type_limbo(e.target.value);
        confirm_open();
      } else {
        set_body_type(e.target.value);
        e.target.value === "file"
          ? ctype_change("custom", "application/octet-stream")
          : ctype_change(e.target.value);
      }
    }
  };

  const confirm_open = () => {
    set_body_type_change_confirm(true);
  };

  const confirm_close = (change) => {
    set_body_type_change_confirm(false);
    if (change === "yes") {
      set_body_type(body_type_limbo);
      ctype_change(body_type_limbo);
    }
  };

  const body_type_map = (btype) => {
    switch (btype) {
      case "multipart":
        return "Multipart form";
      case "urlencoded":
        return "Form URL encoded";
      case "json":
        return "JSON";
      case "other":
        return "Other";
      case "file":
        return "File";
      case "nobody":
        return "No body";
      default:
        break;
    }
  };

  // BODY HANDLERS
  const multipart_handler = (e, i, param, action_type, param_type) => {
    let cur_multipart = [...multipart];

    switch (action_type) {
      case "change":
        cur_multipart[i][param] = e.target.value;
        break;
      case "add":
        cur_multipart.push({
          name: "",
          value: "",
          type: "text",
          selected: true,
        });
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
        cur_urlencoded.push({
          name: "",
          value: "",
          type: "text",
          selected: true,
        });
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

  const textother_handler = (e) => {
    set_textother(e.target.value);
  };

  const file_handler = (value, type) => {
    switch (type) {
      case "value_change":
        set_file(value);
        break;
      case "header_change":
        ctype_change("custom", value);
        break;
      default:
        break;
    }
  };

  // HEADER HANDLER
  const header_handler = (e, i, name_or_value, type) => {
    let cur_headers = [...headers];

    switch (type) {
      case "change":
        cur_headers[i][name_or_value] = e.target.value;
        break;
      case "add":
        cur_headers.push({ name: "", value: "", selected: true });
        break;
      case "delete":
        cur_headers.splice(i, 1);
        break;
      case "edit_type":
        cur_headers = [...name_or_value];
        break;
      default:
        break;
    }

    set_headers(cur_headers);
  };

  // set headers and data when submit is clicked
  const handle_submit = () => {
    let req_config = {};
    req_config["method"] = req_type;
    req_config["url"] = req_url;

    let req_headers = {};
    for (let index = 0; index < headers.length; index++) {
      if (headers[index]["selected"])
        req_headers[headers[index]["name"]] = headers[index]["value"];
    }
    req_config["headers"] = req_headers;

    var req_data;

    switch (body_type) {
      case "multipart":
        req_data = new FormData();
        multipart.forEach((obj) => {
          if (obj.selected) req_data.append(obj.name, obj.value);
        });
        break;

      case "urlencoded":
        let urlencoded_object = {};
        urlencoded.forEach((obj) => {
          if (obj.selected) urlencoded_object[obj["name"]] = obj["value"];
        });
        req_data = qs.stringify(urlencoded_object);
        break;

      case "json":
        req_data = textjson.value;
        break;

      case "other":
        req_data = textother;
        break;
      case "file":
        req_data = file;
        break;
      case "nobody":
        break;
      default:
        break;
    }

    req_config["data"] = req_data;

    props.handler(req_config);
  };

  // get body jsx from components
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

      case "other":
        return_body.push(
          <TextOther state={textother} handler={textother_handler} />,
        );
        break;
      case "file":
        return_body.push(<File state={file} handler={file_handler} />);
        break;
      case "nobody":
        return_body.push(<div></div>);
        break;
      default:
        return_body.push("under construction");
        break;
    }

    return return_body;
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
            <MenuItem value="patch">PATCH</MenuItem>
            <MenuItem value="delete">DELETE</MenuItem>
            <MenuItem value="options">OPTIONS</MenuItem>
            <MenuItem value="head">HEAD</MenuItem>
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
            Body{" "}
            <Chip
              label={body_type_map(body_type)}
              variant="outlined"
              style={{ marginLeft: "10px" }}
            />
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

                <MenuItem value="multipart">
                  {body_type_map("multipart")}
                  <Chip
                    label={multipart.length}
                    variant="outlined"
                    style={{
                      marginLeft: "10px",
                      display: multipart.length ? "inline-flex" : "none",
                    }}
                  />
                </MenuItem>
                <MenuItem value="urlencoded">
                  {body_type_map("urlencoded")}
                  <Chip
                    label={urlencoded.length}
                    variant="outlined"
                    style={{
                      marginLeft: "10px",
                      display: urlencoded.length ? "inline-flex" : "none",
                    }}
                  />
                </MenuItem>
                <Divider />
                <ListSubheader
                  color="primary"
                  component="span"
                  style={{ pointerEvents: "none" }}
                >
                  Text
                </ListSubheader>
                <MenuItem value="json">{body_type_map("json")}</MenuItem>
                <MenuItem value="other">{body_type_map("other")}</MenuItem>
                <Divider />
                <ListSubheader
                  color="primary"
                  component="span"
                  style={{ pointerEvents: "none" }}
                >
                  Other
                </ListSubheader>
                <MenuItem value="file">{body_type_map("file")}</MenuItem>
                <MenuItem value="nobody">{body_type_map("nobody")}</MenuItem>
              </Select>
              {get_body_jsx()}
            </FormControl>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Headers
            <Chip
              label={headers.length}
              variant="outlined"
              style={{
                marginLeft: "10px",
                display: headers.length ? "inline-flex" : "none",
              }}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Headers state={headers} handler={header_handler} />
          </AccordionDetails>
        </Accordion>
        <Dialog open={body_type_change_confirm} onClose={confirm_close}>
          <DialogTitle>{"Change body type?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Changing the body type might result in loss of some input data.
              (For example, if any file uploads have been done, they will be
              reset and need to be reuploaded.)
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
        </Dialog>
      </Grid>
    </Grid>
  );
}

export default Request;
