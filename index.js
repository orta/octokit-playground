export const go = (dtsFiles) => {

// First set up the VSCode loader in a script tag
const getLoaderScript = document.createElement("script");
getLoaderScript.src = "https://www.typescriptlang.org/js/vs.loader.js";
getLoaderScript.async = true;
getLoaderScript.onload = () => {
  // Now the loader is ready, tell require where it can get the version of monaco, and the sandbox
  // This version uses the latest version of the sandbox, which is used on the TypeScript website

  // For the monaco version you can use unpkg or the TypeSCript web infra CDN
  // You can see the available releases for TypeScript here:
  // https://typescript.azureedge.net/indexes/releases.json
  //
  require.config({
    paths: {
      vs: "https://typescript.azureedge.net/cdn/4.0.5/monaco/min/vs",
      sandbox: "https://www.typescriptlang.org/js/sandbox",
    },
    // This is something you need for monaco to work
    ignoreDuplicateModules: ["vs/editor/editor.main"],
  });

  // Grab a copy of monaco, TypeScript and the sandbox
  require([
    "vs/editor/editor.main",
    "vs/language/typescript/tsWorker",
    "sandbox/index",
  ], (main, _tsWorker, sandboxFactory) => {
    const initialCode = `import {Octokit} from "@octokit/rest"

const a = new Octokit()
a.actions.cancelWorkflowRun
    
// Also set up:
octokit
`;

      const isOK = main && window.ts && sandboxFactory;
      if (isOK) {
        document
          .getElementById("loader")
          .parentNode.removeChild(document.getElementById("loader"));
      } else {
        console.error(
          "Could not get all the dependencies of sandbox set up!"
        );
        console.error( "main", !!main, "ts", !!window.ts, "sandbox", !!sandbox);
        return;
      }

      // Create a sandbox and embed it into the the div #monaco-editor-embed
      /** @type {import("./vendor/dts/sandbox").PlaygroundConfig} */
      const sandboxConfig = {
        text: initialCode,
        domID: "monaco-editor-embed",
        acquireTypes: false,
      };

      /** @type {import("./vendor/dts/sandbox").Sandbox} */
      const sb = sandboxFactory.createTypeScriptSandbox( sandboxConfig, main, window.ts);

      // Loop through the paths in the JSON file and add them to the monaco background workers
      Object.keys(dtsFiles).forEach((path) => {
        sb.languageServiceDefaults.addExtraLib( dtsFiles[path], "file:///" + path);
      });

      // Adds a global instance of octokit to the type system
      const globalDTS = `const octokit: import("@octokit/rest").Octokit  `
      sb.languageServiceDefaults.addExtraLib(globalDTS, "file:///node_modules/@types/ambient/index.d.ts");
    })
  }

  return getLoaderScript
}
