import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DatabaseModule } from '@app/common/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Delivery } from './entities/delivery.entity';

@Module({
  imports: [DatabaseModule, SequelizeModule.forFeature([Delivery])],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
