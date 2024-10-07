import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser, GetRawHeaders, Auth } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/';
import { ValidRoles } from 'src/interfaces';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Auth()
  @Get('check-auth-status')
  checkAuthStatus(
    @GetUser() user: User,

  ) {
    return this.authService.checkAuthStatus(user);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('private')
  testPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: User,
    // @Req() request: Express.Request
    @GetRawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log({ request });
    console.log({ userEmail });
    console.log(rawHeaders);
    return {
      ok: true,
      message: 'Hello private route',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  // @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard('jwt'), UserRoleGuard)
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @Get('private2')
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  // @UseGuards(AuthGuard('jwt'), UserRoleGuard)
  // @RoleProtected(ValidRoles.superUser, ValidRoles.admin)

  @Auth(ValidRoles.admin)
  @Get('private3')
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
