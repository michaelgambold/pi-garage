import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import {
  ConsoleLogger,
  forwardRef,
  Inject,
  LoggerService,
  UseGuards,
} from '@nestjs/common';
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
import { DoorsService } from './doors.service';

@UseGuards(WsApiKeyAuthGuard)
@WebSocketGateway({ namespace: 'doors', cors: '*' })
export class DoorsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: LoggerService;

  @WebSocketServer()
  server: Server;

  constructor(
    // don't delete this line it's required so that a clean instance of the orm for
    // each request can be done with the @UseRequestContext
    private readonly orm: MikroORM,
    @Inject(forwardRef(() => DoorsService))
    private readonly doorsService: DoorsService,
    private readonly authService: AuthService,
  ) {
    this.logger = new ConsoleLogger(DoorsGateway.name);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client with id ${client.id} connected`);

    if (!this.authService.hasApiKey()) {
      return;
    }

    const apiKey = client.client.request.headers['x-api-key'] as string;

    if (this.authService.validateApiKey(apiKey)) {
      return;
    }

    client.emit('error', 'Unauthorized');
    client.disconnect();
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
