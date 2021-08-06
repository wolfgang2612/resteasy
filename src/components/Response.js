import React from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";

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
          <Typography>{children}</Typography>
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

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
}));

function Response(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
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
          {props.response
            ? props.response.status + " " + props.response.statusText
            : ""}
        </Alert>
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
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              {props.response
                ? JSON.stringify(props.response.data)
                : "Response data"}
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              {props.response
                ? JSON.stringify(props.response.headers)
                : "Response headers"}
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              {props.response
                ? JSON.stringify(props.response.request)
                : "Sent request"}
            </TabPanel>
          </SwipeableViews>
        </div>
      </Grid>
    </Grid>
  );
}

export default Response;
