import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  public readonly username: string;

  @Field()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  public readonly password: string;
}
