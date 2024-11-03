import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubOrdersService } from './sub-orders.service';
import { CreateSubOrderDto } from './dto/create-sub-order.dto';
import { UpdateSubOrderDto } from './dto/update-sub-order.dto';

@Controller('sub-orders')
export class SubOrdersController {
  constructor(private readonly subOrdersService: SubOrdersService) {}

  @Post()
  create(@Body() createSubOrderDto: CreateSubOrderDto) {
    return this.subOrdersService.create(createSubOrderDto);
  }

  @Get()
  findAll() {
    return this.subOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubOrderDto: UpdateSubOrderDto) {
    return this.subOrdersService.update(+id, updateSubOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subOrdersService.remove(+id);
  }
}
