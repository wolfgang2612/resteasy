import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import axios from "axios";

import Header from "./components/SiteHeader";
import Request from "./components/Request";
import Response from "./components/Response";

function App() {
  const [response, set_response] = useState();

  const submit_handler = (req_config) => {
    console.log(req_config);
    axios(req_config)
      .then((res) => {
        set_response(res);
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
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
          <Response response={response} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
