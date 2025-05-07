declare module 'vite-plugin-raw' {
  interface RawPluginOptions {
    match: RegExp;
    exclude?: RegExp[];
  }
 
  function raw(options: RawPluginOptions): any;
  export default raw;
} 