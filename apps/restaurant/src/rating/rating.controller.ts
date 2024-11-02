import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from '@app/common/authentication/jwt-auth-guard';
import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import { Roles } from '@app/common/constants/role.constants';
import { UserRequest } from '@app/common/database/interfaces/dbConfig.interface';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserTypesEnum.RESTAURANT_ADMIN)
  @Post()
  async create(
    @Body() createRatingDto: CreateRatingDto,
    @Request() req: UserRequest,
  ) {
    const { rating } = await this.ratingService.create(
      createRatingDto,
      req.user,
    );
    return {
      data: { rating },
      success: true,
      message: 'Rating Created Successfully.',
    };
  }

  @Get()
  findAll() {
    return this.ratingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingService.update(+id, updateRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ratingService.remove(+id);
  }
}
