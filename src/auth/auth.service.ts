import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from 'src/interfaces/';
import { JwtService } from '@nestjs/jwt';
import { IncomingHttpHeaders } from 'http';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;
      return { ...user, token: this.getJWTToken({ id: user.id }) };
    } catch (error) {
      console.log({ error });
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user) throw new UnauthorizedException('Not valid credentials (email)');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Not valid credentials (pwd)');
    return { ...user, token: this.getJWTToken({ id: user.id }) };
    // try {

    // } catch (error) {
    //   console.log({ error });
    //   this.handleDBErrors(error);
    // }
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Please check server logs');
  }

  private getJWTToken(payload: JwtPayload) {
    console.log({ getJWTT: payload });
    const token = this.jwtService.sign(payload);
    return token;
  }

  async checkAuthStatus(user: User) {
    try {
      delete user.roles;
      delete user.isActive;
      return {
        ...user,
        token: this.getJWTToken({ id: user.id }),
      };
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException('Token not valid');
    }

    // const token = this.jwtService.sign(payload);
    // return token;
  }
}
