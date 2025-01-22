import jwt from 'jsonwebtoken';

export const generateToken = (id: string, status: string, role: string, fullName: string) => {
    const accessToken = jwt.sign({ id, status, role, fullName }, process.env.JWT_SECRET_KEY as string, { expiresIn: process.env.JWT_TOKEN_EXPIRES as string });
    const refreshToken = jwt.sign({ id, status, role, fullName }, process.env.JWT_REFRESH_SECRET_KEY as string, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES as string });

    return { accessToken, refreshToken };
}