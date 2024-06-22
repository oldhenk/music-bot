import { TrackSkipReason, useQueue } from 'discord-player';
import { SocketUser } from '../socket.js';
import type { Socket } from 'socket.io';
import { PlayerMetadata } from '#bot/player/PlayerMetadata';
import { EmbedGenerator } from '#bot/utils/EmbedGenerator';

export async function MoveAction(
  info: SocketUser,
  socket: Socket,
  index: number
) {
  const queue = useQueue<PlayerMetadata>(info.guildId);
  if (!queue?.connection) return socket.disconnect(true);
  
  try {
    const track = queue.moveTrack(index,0);

    await queue.metadata.channel.send({
        embeds: [
          EmbedGenerator.Success({
            title: 'Track Moved!',
            description: `Track moved by ${info.displayName} (<@${info.id}>).`,
          }),
        ],
      });
    
      return socket.emit('move', index);
  } catch{
    return socket.emit('error', 'Failed to remove that track.');
  }
}