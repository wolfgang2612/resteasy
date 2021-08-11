import React, { useEffect } from "react";

import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

import SaveIcon from "@material-ui/icons/Save";

import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
  table: {
    width: "100%",
  },
}));

function Response(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [body, set_body] = React.useState(<div></div>);
  const [headers, set_headers] = React.useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  useEffect(() => {
    if (props.response) {
      parse_body(props.response);
      set_headers(props.response.headers);
      console.log(props.response.request);
    }
  }, [props.response]);

  const parse_body = (res) => {
    console.log(res);
    let return_body;
    let ctype = "";
    if (res.headers["content-type"])
      ctype = res.headers["content-type"].split(";")[0];
    switch (ctype) {
      case "application/json":
        return_body = (
          <TextField
            label="JSON response"
            fullWidth
            multiline
            minRows={8}
            maxRows={16}
            variant="filled"
            value={JSON.stringify(res.data, null, "\t")}
          />
        );
        break;
      case "text/plain":
        return_body = (
          <TextField
            label="Text response"
            fullWidth
            multiline
            minRows={8}
            maxRows={16}
            variant="filled"
            value={res.data}
          />
        );
        break;
      default:
        let data = new Blob([res.data], { type: ctype });
        let data_url = window.URL.createObjectURL(data);
        let download_button = (
          <Button
            variant="contained"
            color="secondary"
            href={data_url}
            endIcon={<SaveIcon />}
            download={"data" + new Date().toLocaleString()}
            fullWidth
          >
            Download
          </Button>
        );
        return_body = [];
        return_body.push("Data is not JSON or text, click to download: ");
        return_body.push(<br />);
        return_body.push(download_button);
        return_body.push(<hr />);
        return_body.push(res.data);
        break;
    }

    set_body(return_body);
  };

  var status_text, size_text, time_text;
  if (props.response) {
    status_text = (
      <span>
        Status: <strong>{props.response.status}</strong>
      </span>
    );

    size_text = (
      <span>
        Size: {new Blob([JSON.stringify(props.response.data)]).size} bytes
      </span>
    );

    time_text = <span>Timing: {props.response.query_time}ms</span>;
  }

  return (
    <Grid container item xs={12}>
      <Grid container item xs={12} spacing={1}>
        <Grid item xs={3}>
          <Alert
            severity={
              props.response
                ? props.response.status < 400
                  ? "success"
                  : "error"
                : "info"
            }
            style={{
              marginBottom: "10px",
              display: props.response ? "flex" : "none",
            }}
          >
            {props.response ? status_text : ""}
          </Alert>
        </Grid>
        <Grid item xs={5}>
          {props.response ? (
            <Alert
              severity="info"
              style={{
                marginBottom: "10px",
                display: props.response ? "flex" : "none",
              }}
            >
              {props.response ? size_text : ""}
            </Alert>
          ) : (
            ""
          )}
        </Grid>
        <Grid item xs={4}>
          {props.response ? (
            <Alert
              severity="info"
              style={{
                marginBottom: "10px",
                display: props.response ? "flex" : "none",
              }}
            >
              {props.response ? time_text : ""}
            </Alert>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Response" {...a11yProps(0)} />
              <Tab label="Headers" {...a11yProps(1)} />
              <Tab label="Request" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          {props.loading ? (
            <Grid container item xs={12} justifyContent="center">
              <CircularProgress style={{ marginTop: "10px" }} />
            </Grid>
          ) : (
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                {props.response ? body : "Response data"}
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                {props.response ? (
                  <TableContainer component={Paper}>
                    <Table
                      className={classes.table}
                      aria-label="customized table"
                    >
                      <TableBody>
                        {Object.keys(headers).map((name) => (
                          <StyledTableRow key={name}>
                            <TableCell component="th" scope="row">
                              {name}
                            </TableCell>
                            <TableCell align="right">{headers[name]}</TableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  "Response headers"
                )}
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                {props.response ? (
                  <TextField
                    label="Request config (axios)"
                    fullWidth
                    multiline
                    minRows={8}
                    maxRows={16}
                    variant="filled"
                    value={JSON.stringify(props.response.config, null, "\t")}
                  />
                ) : (
                  "Sent request"
                )}
              </TabPanel>
            </SwipeableViews>
          )}
        </div>
      </Grid>
    </Grid>
  );
}

export default Response;
