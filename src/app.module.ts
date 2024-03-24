import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule'
import { AuthMiddleware } from './middleware/auth.middleware';
import { PegawaiModule } from './module/pegawai/pegawai.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            autoLoadModels: true,
            synchronize: false,
            logging: false,
        }),
        ScheduleModule.forRoot(),
        UserModule,
        AuthModule,
        PegawaiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(AuthMiddleware)
        .exclude(
            'api/(.*)',
            'auth/(.*)',
            '(.*)/public/(.*)',
            'uploads/(.*)',
        )
        .forRoutes('*')
}
}

