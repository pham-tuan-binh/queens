# Queens with WASM

This project recreates the Queens game from LinkedIn using WebAssembly (WASM).

You can play the game on [Github Pages](https://pham-tuan-binh.github.io/queens/)

## Requirements

- Emscripten SDK (emsdk) to compile C code to WebAssembly.

## Compilation Instructions

To compile queens.c into JavaScript, use the following command:

```bash
emcc -o queens.js queens.c -s EXPORTED_FUNCTIONS="['_malloc', '_free']" -s MODULARIZE -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']"
```

This command:

- Compiles queens.c into queens.js and the corresponding WebAssembly binary (queens.wasm).
- Exports the malloc and free functions to JavaScript.
- Modularizes the output for use in various JavaScript environments.
- Exports runtime methods ccall and cwrap for calling C functions from JavaScript.

## Performance

![](./perf.webp)

You can check the performance of the WASM module here: [Performance Data](https://docs.google.com/spreadsheets/d/1HILsm0HFwCFg3fcJZsbkoS-D1vmgTNDo0d72eIXRJWA/edit?usp=sharing).

## Web File Location

The compiled web files (queens.js, queens.wasm, etc.) should be located in the docs or in the source folder.
