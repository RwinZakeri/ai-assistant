/**
 * @type {import("@svgr/core").Config}
 */
module.exports = {
  typescript: true,
  prettier: true,
  index: false,
  silent: true,
  jsxRuntime: "automatic",
  template: ({ componentName, imports, props, jsx }, { tpl }) => {
    return tpl`
      ${imports}
      export const ${createComponentName(componentName)} = (${props}) => (
        ${jsx}
      );
    `;
  },
};

function createComponentName(oldName) {
  // Svgr add hardcode `Svg` prefix to component names
  return `${oldName.slice(3)}Icon`;
}
