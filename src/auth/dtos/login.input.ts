import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}
