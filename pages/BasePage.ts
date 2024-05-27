import { Page } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async fillInputField(selector: string, value: string) {
    const inputField = await this.page.waitForSelector(selector, {
      state: "visible",
    });
    await inputField.click();
    await inputField.fill(value);
    console.log(`Filled input field '${selector}' with value: ${value}`);
  }

  async waitForSelector(selector: string, state: string = "visible") {
    return await this.page.waitForSelector(selector, { state: "visible" });
  }

  async waitForTimeout(timeout: number) {
    await this.page.waitForTimeout(timeout);
  }

  async clickElement(selector: string) {
    const element = await this.waitForSelector(selector);
    await element.click();
  }
}
