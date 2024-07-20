import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const baseURL = pathToFileURL(`${process.cwd()}/`).href;

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
