import { AppError } from "./AppError.js";

export class UserAlreadyApplied extends AppError {
    constructor(){
        super(
            "USER_ALREADY_APPLIED",
            409,
            "User has already Applied"
        )
    }
}