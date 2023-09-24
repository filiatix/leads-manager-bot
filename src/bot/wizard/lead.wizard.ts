import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { validateOrReject } from 'class-validator';

import { ADD_LEAD_WIZARD_SCENE_ID } from '../../app.constants';
import { LeadsService } from '../../leads/leads.service';
import { LeadCreate } from '../../leads/dto/create-lead.dto';

@Wizard(ADD_LEAD_WIZARD_SCENE_ID)
export class LeadWizard {
  constructor(
    private readonly leadService: LeadsService,
    private leadCreateData: LeadCreate,
  ) {}

  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
    console.log('Enter to scene');
    await ctx.wizard.next();
    return 'Welcome to add lead wizard ✋ Enter lead email';
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
  @WizardStep(5)
  async onCountry(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    this.leadCreateData.country = msg.text;

    try {
      validateOrReject(this.leadCreateData);
    } catch (errors) {
      console.log('Lead data validation failed. Errors: ', errors);
      return `Lead data validation failed. Errors: ${errors}`;
    }

    await this.leadService.addLead(this.leadCreateData);
    // TODO: check if lead successfully registered
    return 'Lead was successfully registered.';
  }
}
