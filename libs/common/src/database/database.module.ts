import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'food-delivery-system',
        synchronize: true,
        autoLoadModels: true,
      }),
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
