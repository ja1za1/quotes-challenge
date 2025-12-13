import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { jwtConstants } from './constants';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  async use(
    req: FastifyRequest['raw'],
    res: FastifyReply['raw'],
    next: () => void,
  ) {
    try {
      // 1. Extrair o token do cabeçalho Authorization
      const authHeader = req.headers['authorization'];

      if (authHeader === undefined) {
        throw new UnauthorizedException('Token de autorização não fornecido');
      }

      // 2. Verificar se o token está no formato correto: Bearer <token>
      if (!authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException(
          'Formato de token inválido. Use: Bearer <token>',
        );
      }

      // 3. Extrair o token (remover "Bearer ")
      const token = authHeader.split(' ')[1];

      // 4. Verificar se o token não está vazio
      if (!token) {
        throw new UnauthorizedException('Token inválido');
      }

      // 5. Validar o token JWT
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        name: string;
      }>(token, {
        secret: jwtConstants.secret,
      });

      // 6. Adicionar o payload do token à requisição para uso posterior
      if (!payload) {
        throw new UnauthorizedException('Token inválido');
      }

      // 7. Registrar log (opcional)
      this.logger.debug(
        `Usuário autenticado: ${payload.sub} - ${payload.name}`,
      );

      // 8. Chamar next() para continuar o fluxo
      next();
    } catch (error) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        throw new UnauthorizedException('Token inválido ou expirado');
      }
      throw error;
    }
  }
}
