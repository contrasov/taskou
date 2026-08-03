import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async register(register: RegisterDto) {

        const hashedPassword = await bcrypt.hash(register.password, 10);

        return await this.prisma.user.create({
            data: {
                username: register.username,
                email: register.email,
                password: hashedPassword,
            }
        })
    }

    async login(login: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: login.email }
        })

        if (!user) {
            throw new UnauthorizedException('E-mail ou senha incorretos')
        }

        const isCorrectPassword = await bcrypt.compare(login.password, user.password)

        if (!isCorrectPassword) {
            throw new UnauthorizedException('E-mail ou senha incorretos')
        }

        const payload = {sub: user.id, email: user.email};
        const token = this.jwtService.sign(payload);

        return {
            token,
            user
        };
    }
}
