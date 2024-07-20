import { register } from 'node:module';

await register('./hookImport.js', import.meta.url);
