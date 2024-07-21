import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const baseURL = pathToFileURL(`${process.cwd()}/`).href;
const baseURLNodeModules = pathToFileURL(`${process.cwd()}/node_modules`).href;
const CODE_TO_INJECT = `import { fileURLToPath as __fileURLToPathInternal, pathToFileURL as __pathToFileURLInternal } from "node:url";
import { dirname as __dirnameInternal } from "node:path";
import { createRequire as __createRequireInternal } from "node:module";
const __filename = import.meta.filename || __fileURLToPathInternal(import.meta.url);
const __dirname = import.meta.dirname || __dirnameInternal(__filename);
if (!import.meta.filename) import.meta.filename = __filename;
if (!import.meta.dirname) import.meta.dirname = __dirname;
const require = __createRequireInternal(import.meta.url);\n`;

export async function resolve(specifier, context, nextResolve) {
  const { parentURL = baseURL } = context;
  if (specifier.startsWith('../') || specifier.startsWith('./')) {
    const require = createRequire(parentURL);
    return nextResolve(
      pathToFileURL(require.resolve(specifier)).href,
      context,
      nextResolve
    );
  }
  return nextResolve(specifier, context, nextResolve);
}

export const load = async (url, context, loadDefaultAsync) => {
    const loaded = await loadDefaultAsync(url, context, loadDefaultAsync);
    if (loaded.source 
        && loaded.format !== 'builtin' 
        && !loaded.responseURL.startsWith(baseURLNodeModules)
    ) {
        const originalSource = loaded.source.toString();
        const newSource = CODE_TO_INJECT + originalSource;
        loaded.source = Buffer.from(newSource, 'utf8');
    }
    return loaded;
}
