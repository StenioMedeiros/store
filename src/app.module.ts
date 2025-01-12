import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {StoresModule} from "./stores/stores.module"

@Module({
  imports: [UserModule, StoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
