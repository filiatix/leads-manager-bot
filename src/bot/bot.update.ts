import { Command, Ctx, Start, Update } from 'nestjs-telegraf';

import { Context } from '../interfaces/context.interface';
import { ADD_LEAD_WIZARD_SCENE_ID } from '../app.constants';

@Update()
export class BotUpdate {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply('Welcome! use /addLead to add a new lead.');
  }

  @Command('addLead')
  async onWizardCommand(@Ctx() ctx: Context): Promise<void> {
    console.log('context scene', ctx.scene);
    await ctx.scene.enter(ADD_LEAD_WIZARD_SCENE_ID);
  }
}
