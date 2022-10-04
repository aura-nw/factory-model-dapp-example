import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {
  SERVICE_INTERFACE,
} from './module.config';
import { NFTService } from './services/impls/nft.service';
import { NftController } from './controllers/nft.controller';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt.strategy';
import { contextMiddleware } from './middlewares';
import { KMSService } from './services/impls/kms.service';
import { KMSController } from './controllers/kms.controller';


const controllers = [
  NftController,
  KMSController,
];

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    CacheModule.register({ ttl: 10000 }),
    SharedModule,
    JwtModule.registerAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.jwtConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [...controllers],
  providers: [
    //jwt
    // JwtStrategy,
    //service
    {
      provide: SERVICE_INTERFACE.INFT_SERVICE,
      useClass: NFTService,
    },
    {
      provide: SERVICE_INTERFACE.IKMS_SERVICE,
      useClass: KMSService,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
  }
}
