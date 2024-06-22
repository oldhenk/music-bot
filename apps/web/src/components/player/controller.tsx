import { useSocket, useSocketEvent } from '@/context/socket.context';
import type { SerializedTrack } from 'music-bot/src/web/types';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { AlbumCover } from './album-cover';
import { VolumeController } from './volume-controller';
import { TimelineActions } from './timeline-actions';
import { TrackProgress } from './track-progress';
import { useToast } from '../ui/use-toast';
import { ActionIcon } from './action-icon';
import { EqualizerIcon } from './equalizer-icon';
import { Equalizer } from './equalizer';
import { cn } from '@/lib/utils';
import { TrackList} from './queue'
import { AvatarImage } from '../ui/avatar';
import { Avatar } from '@radix-ui/react-avatar';
import Image from 'next/image';
import { BackpackIcon } from '@radix-ui/react-icons';

export function PlayerController({ showArt = false }) {
  const { send } = useSocket();
  const [currentTrack, setCurrentTrack] = useState<SerializedTrack | null>(
    null
  );
  const [tracks, setTracks] = useState<SerializedTrack[]>(
    []
  );
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState({
    current: '0:00',
    total: '0:00',
  });
  const [shuffle, setShuffle] = useState(false);
  const { toast } = useToast();
  const onvolumechange = useCallback(
    (volume: number) => {
      send('volume', volume);
    },
    [send]
  );

  useSocketEvent('playerStart', (track) => {
    setCurrentTrack(track);
    setPaused(false);
  });

  useSocketEvent('pause', (paused) => {
    setPaused(paused);
  });

  useSocketEvent('volume', (volume) => {
    setVolume(volume);
  });

  useSocketEvent('statistics', (data) => {
    setPaused(data.paused);
    setVolume(data.volume);
    setProgress(data.timestamp?.progress ?? 0);
    setDuration({
      current: data.timestamp?.current.label ?? '0:00',
      total: data.timestamp?.total.label ?? '0:00',
    });
    setCurrentTrack(data.track);
    setShuffle(data.shuffle);
    setTracks(data.queue);
  });

  useSocketEvent('playerFinish', () => {
    setCurrentTrack(null);
  });

  useSocketEvent('queued', ({ data, playlist }) => {
    toast({
      title: `${playlist ? 'Playlist' : 'Track'} queued!`,
      // @ts-expect-error
      description: `${data.title} by ${
        // @ts-expect-error
        typeof data.author === 'string' ? data.author : data.author.name
      } has been queued successfully!`,
      variant: 'success',
      duration: 3000,
    });
  });

  useSocketEvent('error', (error) => {
    toast({
      title: 'Error!',
      description: error,
      variant: 'destructive',
      duration: 3000,
    });
  });

  return (
    <>
      <div className="flex flex-row h-full overflow-hidden">
      <TrackList tracks={tracks} />
      <div className="grow">
      {showEqualizer ? (
        <Equalizer onClose={() => setShowEqualizer(false)} />
      ) : showArt && currentTrack && tracks ? (    
        // <img className="object-cover h-1000 w-full" src={currentTrack.thumbnail?.url ?? currentTrack.thumbnail}></img>   
        <div className="h-full flex flex-col justify-center items-center">
        <div className="relative h-full w-full blur-md" style={{
                      backgroundImage:`url('${currentTrack?.thumbnail?.url ?? currentTrack?.thumbnail}')`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      }}></div>
        <div className="absolute grid h-full items-center justify-center">
          <div className="text-center flex items-center flex-col">
            <AlbumCover
              icon={currentTrack?.thumbnail?.url ?? currentTrack?.thumbnail}
              fallback={currentTrack?.title}
            />
            <h1 className="text-2xl mt-4 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{currentTrack?.title}</h1>
            <span className="text-sm text-muted-foreground drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              {currentTrack?.author ?? 'N/A'}
            </span>
          </div>
          </div>
          </div>
      ) : null}
      </div>
      </div>
      <div className="bottom-0 left-0 px-5 py-5 border-t w-full flex items-center justify-between bg-background z-20">
        <div className="flex items-center gap-2">
          <AlbumCover
            icon={currentTrack?.thumbnail?.url ?? currentTrack?.thumbnail}
            fallback={currentTrack?.title}
            className="h-12 w-12"
          />

          <div className="flex flex-col items-start">
            <Link
              href={currentTrack?.url || '#'}
              target={currentTrack ? '_blank' : undefined}
              className="font-semibold hover:underline"
              title={currentTrack?.title}
            >
              {currentTrack?.title
                ?.slice(0, 27)
                .concat(currentTrack.title.length > 27 ? '...' : '') ??
                'Not Playing'}
            </Link>
            <span className="text-xs text-muted-foreground">
              {currentTrack?.author ?? 'N/A'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-[60%]">
          <TimelineActions paused={paused} shuffle={shuffle} />
          <TrackProgress duration={duration} progress={progress} />
        </div>
        <div className="flex items-center gap-3 w-[8%]">
          <ActionIcon
            name="Equalizer"
            onClick={() => setShowEqualizer((p) => !p)}
          >
            <EqualizerIcon
              className={cn(
                'h-4 w-4 cursor-pointer',
                showEqualizer ? 'text-destructive' : ''
              )}
            />
          </ActionIcon>
          <VolumeController volume={volume} onChange={onvolumechange} />
        </div>
      </div>
      
    </>
  );
}
