import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { validateOrReject } from 'class-validator';

import { ADD_LEAD_WIZARD_SCENE_ID } from '../../app.constants';
import { LeadsService } from '../../leads/leads.service';
import { LeadCreate } from '../../leads/dto/create-lead.dto';
import { UsersService } from '../../users/users.service';
import { MessagesService } from '../../messages/messages.service';

@Wizard(ADD_LEAD_WIZARD_SCENE_ID)
export class LeadWizard {
  constructor(
    private readonly leadService: LeadsService,
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
    private leadCreateData: LeadCreate,
  ) {}

  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
    await ctx.wizard.next();
    return 'Welcome to adding lead wizard ✋ Enter lead email';
  }

  @On('text')
  @WizardStep(2)
  async onEmail(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    this.leadCreateData.email = msg.text;
    await ctx.wizard.next();
    return 'Enter lead phone';
  }

  @On('text')
  @WizardStep(3)
  async onPhone(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    this.leadCreateData.phone = msg.text;
    await ctx.wizard.next();
    return 'Enter lead firstname';
  }

  @On('text')
  @WizardStep(4)
  async onFirstName(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    this.leadCreateData.firstName = msg.text;
    await ctx.wizard.next();
    return 'Enter lead lastname';
  }

  @On('text')
  @WizardStep(5)
  async onLastName(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    this.leadCreateData.lastName = msg.text;
    await ctx.wizard.next();
    return 'Enter lead country ISO';
  }

  @On('text')
  @WizardStep(6)
  async onCountry(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    this.leadCreateData.countryId = msg.text;
    try {
      const validateResult = await validateOrReject(this.leadCreateData);
      console.log('Lead data validation result: ', validateResult);
    } catch (errors) {
      console.log('Lead data validation failed. Errors: ', errors);
      await ctx.scene.leave();
      return `Lead data validation failed. Errors: ${errors}`;
    }
    try {
      const lead = await this.leadService.createLead(this.leadCreateData);
      console.log('Lead was successfully registered.');
      const activeUsers = await this.usersService.findActiveUsers();
      console.log('activeUsers', activeUsers);
      activeUsers.forEach(async (user) => {
        const newMessage = this.messagesService.createMessage();
        newMessage.user = user;
        newMessage.lead = lead;
        await this.messagesService.saveMessage(newMessage);
      });
    } catch (e) {
      console.log('Lead creation failed. Error: ', e);
      await ctx.scene.leave();
      return `Lead creation failed. Error: ${e}`;
    }
    await ctx.scene.leave();
    return 'Lead was successfully registered.';
  }
}
