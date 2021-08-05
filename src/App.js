import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import axios from "axios";

import Header from "./components/SiteHeader";
import Request from "./components/Request";

function App() {
  const submit_handler = (req_config) => {
    console.log(req_config);
    axios(req_config)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Grid container justifyContent="space-evenly">
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12} md={5}>
          <Request handler={submit_handler} />
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          display={{ xs: "none", md: "block" }}
        />
        <Grid item xs={12} md={5}>
          output
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
