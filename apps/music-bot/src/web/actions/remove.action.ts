import { TrackSkipReason, useQueue } from 'discord-player';
import { SocketUser } from '../socket.js';
import type { Socket } from 'socket.io';
import { PlayerMetadata } from '#bot/player/PlayerMetadata';
import { EmbedGenerator } from '#bot/utils/EmbedGenerator';

export async function RemoveAction(
  info: SocketUser,
  socket: Socket,
  index: number
) {
  const queue = useQueue<PlayerMetadata>(info.guildId);
  if (!queue?.connection) return socket.disconnect(true);
  
  try {
    const track = queue.removeTrack(index);

    await queue.metadata.channel.send({
        embeds: [
          EmbedGenerator.Success({
            title: 'Track Removed!',
            description: `The ${track?.title} removed by ${info.displayName} (<@${info.id}>).`,
          }),
        ],
      });
    
      return socket.emit('remove', index);
  } catch{
    return socket.emit('error', 'Failed to remove that track.');
  }
}