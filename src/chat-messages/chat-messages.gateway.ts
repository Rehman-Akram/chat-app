import { WebSocketGateway } from '@nestjs/websockets';
import { ChatMessagesService } from './chat-messages.service';

@WebSocketGateway()
export class ChatMessagesGateway {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}
}
