import { Controller } from '@nestjs/common';
import { RiderInformationService } from './rider-information.service';

@Controller('rider-information')
export class RiderInformationController {
  constructor(
    private readonly riderInformationService: RiderInformationService,
  ) {}
}
