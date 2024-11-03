import { Module } from '@nestjs/common';
import { SubOrdersService } from './sub-orders.service';
import { SubOrdersController } from './sub-orders.controller';
import { SubOrder } from './entities/sub-order.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
  imports: [DatabaseModule, SequelizeModule.forFeature([SubOrder])],
  controllers: [SubOrdersController],
  providers: [SubOrdersService],
})
export class SubOrdersModule {}
