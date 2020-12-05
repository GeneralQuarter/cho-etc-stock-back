import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlaisirsFermiersApiService } from './plaisirs-fermiers-api.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [PlaisirsFermiersApiService],
  exports: [PlaisirsFermiersApiService],
})
export class PlaisirsFermiersApiModule {}
