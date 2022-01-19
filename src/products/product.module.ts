import { Module } from '@nestjs/common';
import { ProudctService } from './product.service';
import { ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController],
  providers: [ProudctService],
})
export class ProductModule {}
