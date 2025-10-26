import { Expose } from "class-transformer";

export class AdminDto {
    @Expose()
    name:string
    @Expose()
    email:string
    @Expose()
    phone:string
    @Expose()
    role:string
}