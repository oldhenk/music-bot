import { PlayerMetadata } from '#bot/player/PlayerMetadata';
import { fetchPlayerOptions } from '#bot/player/playerOptions';
import { EmbedGenerator } from '#bot/utils/EmbedGenerator';
import type { CommandData, SlashCommandProps } from 'commandkit';
import { QueueRepeatMode, useMainPlayer } from 'discord-player';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { useQueue } from "discord-player";
import { useTimeline } from 'discord-player';

export const data: CommandData = {
    name: 'queue',
    description: 'Queue',
  };

  export async function run({ interaction }: SlashCommandProps) {
    if (!interaction.inCachedGuild()) return;
  
    await interaction.deferReply();

    const timeline = useTimeline(interaction.guildId);

    if (!timeline?.track) {
        const embed = EmbedGenerator.Error({
        title: 'Not playing',
        description: 'I am not playing anything right now',
        }).withAuthor(interaction.user);

        return interaction.editReply({ embeds: [embed] });
    }

    const queue = useQueue(interaction.guild.id);

    var tracks: any[] = [];
    if (queue !== null){
        tracks = queue.tracks.toArray();
        tracks.unshift(queue.currentTrack);
    }
    console.log(`tracks=${tracks}`)
    queue_song(interaction,tracks)
  
    return;
  }




  import { Message, MessageReaction, User } from 'discord.js';

  const queue_song = async (interaction: any, queue: any[]) => {
      try {
          console.log(`tracks=${queue}`)  
          let currentPage = 0;
          const embeds = generateQueueEmbed(queue);
          console.log(embeds);
          const message = await interaction.editReply({ content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], fetchReply: true });
          await message.react('⬅️');
          await message.react('⏹');
          await message.react('➡️');
          const filter = (reaction: MessageReaction, user: User) => {
              return (reaction.emoji.name !== null) && ['⬅️', '⏹', '➡️'].includes(reaction.emoji.name) && user.id === interaction.member.id;
          };
          const collector = message.createReactionCollector({ filter, time: 300000 });
          collector.on('collect', async (reaction: MessageReaction, user: User) => {
              try {
                  if (reaction.emoji.name === '➡️') {
                      if (currentPage < embeds.length - 1) {
                          currentPage++;
                          message.editReply({ content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]] });
                      }
                  } else if (reaction.emoji.name === '⬅️') {
                      if (currentPage !== 0) {
                          --currentPage;
                          message.editReply({ content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]] });
                      }
                  } else {
                      await collector.stop();
                      await reaction.message.reactions.removeAll();
                      await message.delete();
                      return;
                  }
                  await reaction.users.remove(message.author.id);
              } catch (err) {
                  console.log(err);
                  //return interaction.editReply({ content: "❌ An error occured", ephemeral: true });
              }
          });
      } catch (err) {
          console.log(err);
          //return interaction.editReply({ content: "❌ An error occured", ephemeral: true });
      }
  }
  
  function generateQueueEmbed(queue: any[]) {
      const embeds: any[] = [];
      console.log(`gen=${queue}`)
      let k = 10;
      for (let i = 0; i < queue.length; i += 10) {
          const current = queue.slice(i, k);
          const tmp = `**Current Song - [${queue[0].title}](${queue[0].url})**`;
          let j = i;
          k += 10;
          const info = current.map(track => `${++j} - [${track.title}](${track.url})`).join('\n');
          const embed = new EmbedBuilder()
              .setTitle('Song Queue\n')
              .setColor("#F8AA2A")
              .setDescription(tmp.concat(`\n\n${info}`.toString()))
              .setTimestamp();
          embeds.push(embed);
      }
      return embeds;
  }  