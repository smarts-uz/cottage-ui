# Cottage UI

A sample UI library for the Build A React UI Library series: https://www.youtube.com/playlist?list=PLcfAVClOb1BiA6oIfHQ6Am3lpWzOmMO6J

## Changelog (manual)

- 0.0.3 - add TailwindCSS and Storybook
- 0.0.2
- 0.0.1

import React from "https://cdn.jsdelivr.net/npm/react@18.3.1/+esm";
import ReactDOM from "https://cdn.jsdelivr.net/npm/react-dom@18.3.1/+esm";
import { Button, Table } from "https://cdn.jsdelivr.net/npm/@teamprodevs/cottage-ui@0.1.0/+esm";

function App() {
return (
<div className="app">
<Button updateModel={appsmith.updateModel}>Hello Smurfs</Button>
<Table />

</div>
);
}
appsmith.onReady(() => {
	ReactDOM.render(<App />, document.getElementById("root"));
});
