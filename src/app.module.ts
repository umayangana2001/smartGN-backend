
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestsModule } from './requests/requests.module';
import { GnUsersModule } from './gn-users/gn-users.module';
import { GnRequestsModule } from './gn-requests/gn-requests.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'smartgn_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true,
    }),
    RequestsModule,
    GnUsersModule,
    GnRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}