import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'; 
import { AuthResolver } from './auth/auth.resolver';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { TaskService } from './task/task.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TaskResolver } from './task/task.resolver';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tometometometome',
      signOptions: {expiresIn: '7d'},
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault({embed: true})],
      context: ({req}) => ({req})
    }),
  ],
  providers: [AuthResolver, AuthService, PrismaService, TaskService, TaskResolver, JwtStrategy],
})
export class AppModule {}
