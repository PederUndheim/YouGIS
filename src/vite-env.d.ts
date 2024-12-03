/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_MAPBOX_TOKEN: string; // Specify the type of your environment variable
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  