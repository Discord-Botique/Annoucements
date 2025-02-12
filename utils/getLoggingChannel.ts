import {
  ChannelType,
  GuildChannelManager,
  OverwriteType,
  PermissionsBitField,
  TextChannel,
} from "discord.js";

export const getLoggingChannel = async (
  guildChannelManager: GuildChannelManager,
  loggingChannel: string = "fbi-logs",
): Promise<TextChannel> => {
  const channel = guildChannelManager.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildText &&
      channel.name.toLowerCase() === loggingChannel,
  ) as TextChannel | undefined;

  if (channel) return channel;

  return guildChannelManager.create({
    name: loggingChannel,
    type: ChannelType.GuildText,
    topic:
      "Logs generated by " +
      (guildChannelManager.client.user?.username || "Unknown Bot"),
    permissionOverwrites: [
      {
        type: OverwriteType.Role,
        id: guildChannelManager.guild?.roles.everyone,
        deny: PermissionsBitField.All,
      },
    ],
  });
};
