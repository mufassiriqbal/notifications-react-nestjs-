import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userModel
      .findOne({ username: dto.username })
      .exec();

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({
      fullName: dto.fullName,
      username: dto.username,
      password: hashedPassword,
    }) as UserDocument;
    const savedUser = await user.save();
    const { password: _password, ...userWithoutPassword } =
      savedUser.toObject();

    return userWithoutPassword;
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; user: Omit<User, 'password'> }> {
    const invalidCredentials = new UnauthorizedException(
      'Invalid username or password',
    );
    const user = await this.userModel
      .findOne({ username: dto.username })
      .select('+password')
      .exec();

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw invalidCredentials;
    }

    const { password: _password, ...userWithoutPassword } = user.toObject();
    const accessToken = this.jwtService.sign({
      sub: user._id.toString(),
      username: user.username,
    });

    return { accessToken, user: userWithoutPassword };
  }
}
