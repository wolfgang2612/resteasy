import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import axios from "axios";

import Header from "./components/SiteHeader";
import Request from "./components/Request";
import Response from "./components/Response";

function App() {
  const [response, set_response] = useState();
  const [loading, set_loading] = useState(false);

  const submit_handler = (req_config) => {
    set_loading(true);
    let start_time = Date.now();
    axios(req_config)
      .then((res) => {
        let end_time = Date.now();
        set_loading(false);
        set_response({
          ...res,
          query_time: end_time - start_time,
        });
      })
      .catch((error) => {
        let end_time = Date.now();
        set_loading(false);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response);
          set_response({
            ...error.response,
            query_time: end_time - start_time,
          });
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
          set_response({
            status: "-",
            headers: { ...error.config.headers, "content-type": "text/plain" },
            data: error.message,
            config: error.config,
            query_time: end_time - start_time,
          });
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
          set_response({
            status: "-",
            headers: error.config.headers,
            data:
              "Something happened in setting up the request that triggered an Error: " +
              error.message,
            config: error.config,
            query_time: end_time - start_time,
          });
        }
        console.log(error.toJSON());
      });
  };

  return (
    <div style={{ marginBottom: "20px" }}>
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
          <Response response={response} loading={loading} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
