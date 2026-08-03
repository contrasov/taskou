import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './dto/user.model';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService){}

    @Mutation(() => User)
    async register(@Args('registerInput') register: RegisterDto){
        return this.authService.register(register);
    }

    @Mutation(() => User)
    async login(@Args('loginInput') login: LoginDto){
        return this.authService.login(login);
    }

    @Query(() => String)
    health() {
        return 'Ta rodando!';
    }

}
