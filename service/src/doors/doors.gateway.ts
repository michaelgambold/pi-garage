import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { WsApiKeyAuthGuard } from '../auth/ws-api-key-auth.guard';
import { ClientVersionService } from '../client-version/client-version.service';
import { WsClientVersionGuard } from '../client-version/ws-client-version.guard';
import { DoorsService } from './doors.service';
import { Logger } from '../logger/logger';

@UseGuards(WsClientVersionGuard, WsApiKeyAuthGuard)
@WebSocketGateway({ namespace: 'doors', cors: '*' })
export class DoorsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger;

  @WebSocketServer()
  server: Server;

  constructor(
    // don't delete this line it's required so that a clean instance of the orm for
    // each request can be done with the @UseRequestContext
    private readonly orm: MikroORM,
    @Inject(forwardRef(() => DoorsService))
    private readonly doorsService: DoorsService,
    private readonly authService: AuthService,
    private readonly clientVersionService: ClientVersionService,
  ) {
    this.logger = new Logger(DoorsGateway.name);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client with id ${client.id} connected`);

    try {
      const clientVersion = client.request.headers[
        'x-client-version'
      ] as string;

      if (clientVersion) {
        const serverVersion = this.clientVersionService.getServerVersion();

        if (
          !this.clientVersionService.satisfies(clientVersion, serverVersion)
        ) {
          throw new Error('Invalid client version');
        }
      }

      if (!this.authService.hasApiKey()) {
        return;
      }

      const apiKey = client.request.headers['x-api-key'] as string;

      if (!this.authService.validateApiKey(apiKey)) {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      client.emit('error', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client with id ${client.id} disconnected`);
  }

  @SubscribeMessage('doors:list')
  @UseRequestContext()
  async handleDoorsList(client: Socket) {
    const doorsListEvent = 'doors:list';

    try {
      const doors = await this.doorsService.findAll();
      client.emit(doorsListEvent, doors);
    } catch (e) {
      client.emit('error', e.message);
      client.emit(doorsListEvent, []);
    }
  }
}
