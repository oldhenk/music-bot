import React from 'react';
import { useSocket } from '@/context/socket.context';
import type { SerializedTrack } from 'music-bot/src/web/types';
import { cn } from "@/lib/utils"
import { AlbumCover } from './album-cover';
import Link from 'next/link';
import { ActionIcon } from './action-icon';
import {
  PauseIcon,
  PlayIcon,
  ShuffleIcon,
  TextAlignTopIcon,
  PinTopIcon,
  TrashIcon,
} from '@radix-ui/react-icons';


export function TrackList({ tracks }: any) {
  // Check if tracks is an array before using map
  if (!Array.isArray(tracks)) {
    return <div>No tracks available</div>;
  }
  if (tracks.length < 1){
    return <div></div>;;
  }
  const { send } = useSocket();
  

  return (
  <div className="basis-1/4 bg-dark border-r-4 border-primary/20 overflow-y-auto">
    <div className="flex flex-col ">
      {tracks.map((track, index) => (
      <div key={index} className="relative h-full py-4 flex items-center  overflow-hidden ">
          <div className="absolute h-full w-full blur-[8px]" style={{
              backgroundImage:`url('${track?.thumbnail?.url ?? track?.thumbnail}')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              }}>          
          </div>
          <div className="flex items-center gap-4 pl-5 justify-between w-full">
            <div className='flex flex-row gap-4 items-center'>
            <AlbumCover
              icon={track.thumbnail?.url ?? track.thumbnail}
              fallback={track.title}
              className="h-16 w-16"
            />
            <div className="flex flex-col items-start">
              <Link
                href={track?.url || '#'}
                target={track ? '_blank' : undefined}
                className="font-semibold hover:underline drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                title={track?.title}
              >
                {track?.title
                  ?.slice(0, 27)
                  .concat(track.title.length > 27 ? '...' : '') ??
                  'Not Playing'}
              </Link>
              <span className="text-xs text-muted-foreground drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                {track?.author ?? 'N/A'}
              </span>    
            </div>
            </div>
            <div className='flex gap-2 z-30 pr-6 items-center drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>
              <ActionIcon
                    onClick={() => {
                      send('move',index);
                    }}
                    name="Move to top"
                    >
                    <TextAlignTopIcon className="h-7 w-7 cursor-pointer" />
              </ActionIcon>
              <ActionIcon
                    onClick={() => {
                      send('remove',index);
                    }}
                    name="Remove"
                    >
                    <TrashIcon className="h-7 w-7 cursor-pointer" />
              </ActionIcon>
              
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}