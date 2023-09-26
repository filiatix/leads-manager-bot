import { Command, Ctx, Start, Update } from 'nestjs-telegraf';

import { Context } from '../interfaces/context.interface';
import { ADD_LEAD_WIZARD_SCENE_ID } from '../app.constants';
import { UsersService } from '../users/users.service';

@Update()
export class BotUpdate {
  constructor(private readonly userService: UsersService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const user = await this.userService.createUser();
    user.id = ctx.from.id;
    user.firstName = ctx.from.first_name;
    user.lastName = ctx.from.last_name;
    user.username = ctx.from.username;
    await this.userService.saveUser(user);
    await ctx.reply(
      `Welcome ${user.firstName} ${user.lastName}! /createLead to add a new lead.`,
    );
  }

  @Command('createLead')
  async onWizardCommand(@Ctx() ctx: Context): Promise<void> {
    console.log('context scene', ctx.scene);
    await ctx.scene.enter(ADD_LEAD_WIZARD_SCENE_ID);
  }
}
