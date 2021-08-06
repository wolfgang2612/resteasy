import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import GitHubIcon from "@material-ui/icons/GitHub";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey["A100"],
    width: "100%",
    margin: "10px",
  },
}));

function SiteHeader() {
  const classes = useStyles();
  return (
    <Grid container item xs={12}>
      <Paper elevation={3} className={classes.root}>
        <Grid container item xs={12} justifyContent="center">
          <Typography variant="h2" gutterBottom align="center">
            REST Easy
          </Typography>
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <Typography variant="h4" gutterBottom align="center">
            A minimal client to send HTML requests!
          </Typography>
        </Grid>
        <Grid container item xs={12} justifyContent="flex-end">
          <IconButton
            aria-label="github"
            href="https://github.com/wolfgang2612/resteasy"
            target="_blank"
          >
            <GitHubIcon />
          </IconButton>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default SiteHeader;
