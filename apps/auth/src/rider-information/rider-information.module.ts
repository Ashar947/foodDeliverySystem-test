import { DatabaseModule } from '@app/common/database/database.module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RiderInformationController } from './rider-information.controller';
import { RiderInformationService } from './rider-information.service';
import { RiderInformation } from './entity/rider-information.entity';

@Module({
  imports: [DatabaseModule, SequelizeModule.forFeature([RiderInformation])],
  controllers: [RiderInformationController],
  providers: [RiderInformationService],
})
export class RiderInformationModule {}
