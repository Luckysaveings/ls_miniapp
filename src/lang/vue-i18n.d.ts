declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $t: (key: string, values?: object) => string;
  }
}
