import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// type
import { Model } from 'mongoose';
import { Product } from './product.model';

@Injectable()
export class ProudctService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({
      title,
      description: desc,
      price,
    });
    const result = await newProduct.save();
    return result.id as string;
  }

  async getProducts() {
    const products = await this.productModel.find().exec(); //exec to return a promise
    return products as Product[];
  }

  async getSingleProduct(productId: string) {
    const product = await this.findProduct(productId);
    return {
      id: product.id,
      tittle: product.title,
      description: product.description,
      price: product.price,
    };
  }

  async updateProduct(
    productId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);
    if (title) updatedProduct.title = title;
    if (desc) updatedProduct.description = desc;
    if (price) updatedProduct.price = price;
    updatedProduct.save();
  }

  async deleteProduct(productId: string) {
    const result = await this.productModel.deleteOne({ _id: productId }).exec(); //exec to return a promise
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find product');
    }
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id);
    } catch (err) {
      console.log(err.message);
      throw new NotFoundException('Could not find product'); // e.g. unexsisit or invalidate id
    }
    if (!product) {
      throw new NotFoundException('Could not find product'); // e.g. after notfound prodcut
    }
    return product;
  }
}
