import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When('User waits for api call for {int}', async function (waitTime) {
  // Write code here that turns the phrase above into concrete actions
  await this.page.waitForTimeout(waitTime);
});
