import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

import Header from "./components/Header";
import Request from "./components/Request";

function App() {
  return (
    <div>
      <Grid container justifyContent="space-evenly">
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12} md={5}>
          <Request />
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
