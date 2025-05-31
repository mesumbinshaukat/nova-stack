#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  .command(
    'generate:model <name>',
    'Scaffold a new data model',
    (yargs) => {
      return yargs.positional('name', { type: 'string', describe: 'Model name' });
    },
    async (argv) => {
      const modelName = argv.name as string;
      console.log(`📦 Scaffolding model: ${modelName}`);
      // For now, simply create an empty file
      // Actual implementation will come later
    }
  )
  .demandCommand()
  .strict()
  .help()
  .parse(); 