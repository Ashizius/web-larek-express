import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import BadRequestError from '../errors/badRequestError';

type Token = { token: string };

export interface IUser {
  _id?: mongoose.ObjectId;
  name: string;
  email: string;
  password: string;
  tokens: [Token];
}

export type UserDocument = mongoose.Document<unknown, {}, IUser> &
  IUser &
  Required<{
    _id: mongoose.Schema.Types.ObjectId;
  }>;

export interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<UserDocument>;
  createUserByCredentials: (
    name: string,
    email: string,
    password: string
  ) => Promise<UserDocument>;
  updateUser: (
    id: mongoose.ObjectId,
    payload: Partial<IUser>
  ) => Promise<UserDocument>;
  updateRefreshToken: (
    id: mongoose.ObjectId,
    token: Token
  ) => Promise<UserDocument>;
  clearRefreshToken: (id: mongoose.ObjectId) => Promise<UserDocument>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  tokens: {
    type: [{ token: String }],
    select: false,
  },
});

userSchema.static(
  'updateRefreshToken',
  function updateRefreshToken(id: mongoose.ObjectId, token: string) {
    return this.findByIdAndUpdate(id, { $push: { tokens: token } });
  },
);

userSchema.static(
  'clearRefreshToken',
  async function clearRefreshToken(id: mongoose.ObjectId) {
    return this.findByIdAndUpdate(id, { $set: { tokens: [] } });
  },
);

userSchema.static(
  'createUserByCredentials',
  async function createUserByCredentials(
    name: string,
    email: string,
    password: string,
  ) {
    return bcrypt
      .hash(password, 10)
      .then((hash: string) => this.create({ name, email, password: hash }));
  },
);

userSchema.static(
  'findUserByCredentials',
  async function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          return Promise.reject(
            new BadRequestError('Неправильная почта или пароль'),
          );
        }
        return bcrypt
          .compare(password, user.password)
          .then((matched: boolean) => {
            if (!matched) {
              return Promise.reject(
                new BadRequestError('Неправильная почта или пароль'),
              );
            }
            return user;
          });
      });
  },
);

userSchema.static(
  'updateUser',
  async function updateUser(id: mongoose.ObjectId, payload: Partial<IUser>) {
    const { password, ...credentials } = payload;
    if (password) {
      return bcrypt.hash(password, 10).then((hash: string) => this.findByIdAndUpdate(
        id,
        { password: hash, ...credentials },
        {
          new: true,
          runValidators: true,
        },
      ));
    }
    return this.findByIdAndUpdate(id, credentials, {
      new: true,
      runValidators: true,
    });
  },
);

export default mongoose.model<IUser, UserModel>('user', userSchema);
