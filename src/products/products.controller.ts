import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProudctService } from './product.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProudctService) {}

  @Post()
  async addProduct(
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ) {
    const genertaedId = await this.productsService.insertProduct(
      prodTitle,
      prodDesc,
      prodPrice,
    );
    return { id: genertaedId };
  }

  @Get()
  async getAllProducts() {
    const products = await this.productsService.getProducts();
    return products.map((prod) => ({
      id: prod.id,
      tittle: prod.title,
      description: prod.description,
      price: prod.price,
    })); //_id from mongo -> id
  }

  @Get(':id')
  getProduct(@Param('id') prodId: string) {
    return this.productsService.getSingleProduct(prodId);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') prodId: string,
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ) {
    await this.productsService.updateProduct(
      prodId,
      prodTitle,
      prodDesc,
      prodPrice,
    );
    return null;
  }

  @Delete(':id')
  async removeProduct(@Param('id') prodId: string) {
    await this.productsService.deleteProduct(prodId);
    return null;
  }
}
