import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UserInputError } from 'apollo-server-errors';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

/**
 *  built as nest docs: https://docs.nestjs.com/pipes#class-validator
 *  for class-validator library 
 */
@Injectable()
export class GraphQLValidationPipe implements PipeTransform<any> {
  /**
   * metatype parameter:
   * The class we defined in dto (e.g. src/posts/dtos/create-post.input.ts)
   * where we use the validation decorators from class-validator libarary
   * */
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) return value;

    const object = plainToClass(metatype, value); // from plain js argument obj to typed object (a Class)
    const err = await validate(object);

    if (err.length > 0) {
      const message = err
        .map((validationErr) => Object.values(validationErr.constraints))
        .flat()
        .join('; ');
      throw new UserInputError(message);
    }
    return value;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
