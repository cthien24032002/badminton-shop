import { BaseDtoWithSlug } from './../../common/dto/base.dto';
import { Expose } from "class-transformer";

export class AdminDto extends BaseDtoWithSlug {
    @Expose()
    name:string
    @Expose()
    email:string
    @Expose()
    phone:string
    @Expose()
    role:string
}