import { Client, Guild } from "discord.js";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";
import differenceInYears from "date-fns/differenceInYears";
import startOfTomorrow from "date-fns/startOfTomorrow";
import { userMention } from "@discordjs/builders";
import { logtail } from "./logtailConfig";
import { getBirthdaySubscriptions } from "./api";
import { Database } from "./supabase.types";
import addHours from "date-fns/addHours";
import getMonth from "date-fns/getMonth";
import getDate from "date-fns/getDate";

type User = Database["public"]["Tables"]["birthdays"]["Row"];

const getUsersWithAnniversaries = async (guild: Guild): Promise<User[]> => {
  const subscriptions = await getBirthdaySubscriptions(guild.id);
  if (!subscriptions || subscriptions.length === 0) return [];
  const users = await guild.members.fetch({
    user: subscriptions.map(({ user_id }) => user_id),
  });
  const filteredSubscriptions = subscriptions?.filter((subscription) =>
    users.has(subscription.user_id)
  );

  const currentMonth = getMonth(new Date());
  const currentDate = getDate(new Date());

  return filteredSubscriptions.filter((user) => {
    const joinMonth = getMonth(new Date(user.birthday));
    const joinDate = getDate(new Date(user.birthday));
    return joinMonth === currentMonth && joinDate === currentDate;
  });
};

const sendMessageForUsers = async (users: User[], guild: Guild) => {
  return Promise.all(
    users.map(async ({ user_id, channel_id, has_year, birthday }) => {
      const channel = await guild.channels.fetch(channel_id);
      if (!channel || !channel.isTextBased()) return;
      await logtail.debug("Sending birthday message", {
        user_id,
        channel_id,
      });
      const difference = differenceInYears(new Date(), new Date(birthday));

      return channel.send(
        `Happy birthday to ${userMention(user_id)}${
          has_year ? ` (${difference})` : ""
        }! :birthday: Please wish them a very happy birthday.`
      );
    })
  );
};

const triggerMessages = async (client: Client<true>) => {
  const guilds = await client.guilds.fetch();

  await Promise.all(
    guilds.map(async (oathGuild) => {
      const guild = await oathGuild.fetch();
      const users = await getUsersWithAnniversaries(guild);
      await logtail.debug(`Found ${users.length} users with anniversaries.`);
      if (users.length > 0) await sendMessageForUsers(users, guild);
    })
  );

  await checkBirthdays(client);
};

const checkBirthdays = async (client: Client<true>) => {
  const timeUntilNextDay = differenceInMilliseconds(
    addHours(startOfTomorrow(), 8),
    new Date()
  );
  await logtail.debug(`Next birthday check in ${timeUntilNextDay}ms`);

  setTimeout(() => {
    triggerMessages(client).catch(async (err) => {
      console.error(err);
      await logtail.error("There was an error sending anniversary messages");
    });
  }, timeUntilNextDay);
};

export default checkBirthdays;
