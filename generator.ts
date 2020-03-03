import { driver } from '@smartlyio/oats';

driver.generate({
  generatedValueClassFile: './generated/common.types.generated.ts',
  generatedServerFile: './generated/server.generated.ts',
  generatedClientFile: './generated/client.generated.ts',
  header: '/* tslint:disable variable-name only-arrow-functions*/',
  openapiFilePath: './openapi.yml'
});
