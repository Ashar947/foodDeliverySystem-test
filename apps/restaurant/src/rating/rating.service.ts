import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating, RatingTypeEnum } from './entities/rating.entity';
import { User } from '@app/common/entities/user.entity';

@Injectable()
export class RatingService {
  async create(createRatingDto: CreateRatingDto, user: User) {
    try {
      // add validation for foreign keys
      // update overall dish/restaurant rating
      const rating = await Rating.create({
        ...createRatingDto,
        userId: user.id,
        ratingType: createRatingDto.orderId
          ? RatingTypeEnum.ORDER
          : RatingTypeEnum.DISH,
      });
      return { rating };
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all rating`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rating`;
  }

  update(id: number, updateRatingDto: UpdateRatingDto) {
    console.log(updateRatingDto);
    return `This action updates a #${id} rating`;
  }

  remove(id: number) {
    return `This action removes a #${id} rating`;
  }
}
