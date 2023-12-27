const App = () => {
	return React.createElement(
	  React.Fragment,
	  null,
	  React.createElement(
		"div",
		{
		  style: { height: "500px" },
		},
		React.createElement(ExcalidrawLib.Excalidraw),
	  ),
	);
  };
  
  const excalidrawWrapper = document.getElementById("app");
  const root = ReactDOM.createRoot(excalidrawWrapper);
  root.render(React.createElement(App));