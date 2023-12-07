import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ElectrictyController } from './electricty/electricty.controller';
import { ElectrictyService } from './electricty/electricty.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, ElectrictyController],
  providers: [AppService, ElectrictyService],
})
export class AppModule {}
