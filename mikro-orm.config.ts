import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Door } from './src/entities/Door';
import { Sequence } from './src/entities/Sequence';

const config = {
  entities: [Door, Sequence],
  dbName: 'pi-garage.sqlite3',
  forceUtcTimezone: true, // sqlite does this by default
  type: 'sqlite',
  metadataProvider: TsMorphMetadataProvider,
} as Options;

export default config;
