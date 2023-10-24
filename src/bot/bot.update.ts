import { Telegraf } from 'telegraf';
import { InjectBot, Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Context } from '../interfaces/context.interface';
import { ADD_LEAD_WIZARD_SCENE_ID, LeadsBotName } from '../app.constants';
import { UsersService } from '../users/users.service';
import { MessagesService } from './../messages/messages.service';

@Update()
export class BotUpdate {
  constructor(
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
    @InjectBot(LeadsBotName)
    private readonly bot: Telegraf<Context>,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const user = this.usersService.createUser();
    user.id = ctx.from.id;
    user.firstName = ctx.from.first_name;
    user.lastName = ctx.from.last_name;
    user.username = ctx.from.username;
    await this.usersService.saveUser(user);
    await ctx.reply(
      `Welcome ${user.firstName} ${user.lastName}! /createLead to add a new lead.`,
    );
  }

  @Command('createLead')
  async onWizardCommand(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(ADD_LEAD_WIZARD_SCENE_ID);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    const messages = await this.messagesService.getMessagesToSend();
    messages.forEach(async (message) => {
      const chatId = message.user.id;
      const text =
        `New lead: *${message.lead.email}* ${message.lead.phone} ${message.lead.firstName} ` +
        `${message.lead.lastName} ${message.lead.countryId} ` +
        `created at ${message.lead.createdAt}`;
      console.log(text);
      this.bot.telegram.sendMessage(chatId, text, { parse_mode: 'Markdown' });
      await this.messagesService.markMessageAsSent(message.id);
    });
  }
}
