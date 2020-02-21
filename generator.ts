import { driver } from '@smartlyio/oats';

driver.generate({
  generatedValueClassFile: './common.types.generated.ts',
  generatedServerFile: './server.generated.ts',
  generatedClientFile: './client.generated.ts',
  header: '/* tslint:disable variable-name only-arrow-functions*/',
  openapiFilePath: './openapi.yml'
});
