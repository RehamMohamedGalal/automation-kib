import { BasePage } from './BasePage';
import faker from 'faker';

export class ProductPage extends BasePage {

    async addProduct() {
        // Click on Add a new product icon
        await this.clickElement('a[href="/add"] >> svg');

        // Generate random product name and description
        const randomProductName = faker.commerce.productName();
        const randomDescription = this.generateRandomDescription(40);
        const randomPrice = faker.datatype.number({ min: 1, max: 1000 }).toString();

        // Fill in new product data
        await this.fillInputField('input[name="title"]', randomProductName);
        await this.fillInputField('input[name="description"]', randomDescription);
        await this.fillInputField('input[name="price"]', randomPrice);

        // Click on the submit button
        await this.clickElement('//*[@id="root"]/div/main/div/form/button');

        // Wait for the search field to be visible after submission
        await this.waitForSelector('input[placeholder="Search for products ..."]');

        return randomProductName; // Return the product name for further verification
    }

    async searchProduct(productName: string) {
        await this.fillInputField('input[placeholder="Search for products ..."]', productName);
        await this.page.keyboard.press("Enter");
        await this.waitForTimeout(3000);
        return await this.page.textContent('#root > div > main > div > div > div > div.grid.grid-cols-4.gap-7 > div > div.sc-kuWgmH.brWvPg.mt-4.cursor-pointer');
    }

    async searchNotExistedProduct(productName: string) {
        await this.fillInputField('input[placeholder="Search for products ..."]', productName);
        await this.page.keyboard.press("Enter");
        await this.waitForTimeout(3000);
        return await this.page.textContent('#root > div > main > div > div > div > div.flex.flex-col.justify-center > p');
    }

    async deleteProduct() {
        const itemTitleSelector = '#root > div > main > div > div > div > div.grid.grid-cols-4.gap-7 > div:nth-child(1) > div.sc-kuWgmH.brWvPg.mt-4.cursor-pointer';
        const itemTitle = await this.page.textContent(itemTitleSelector);
        console.log('Item Title to Delete:', itemTitle);

        const deleteButtonSelector = '#root > div > main > div > div > div > div.grid.grid-cols-4.gap-7 > div:nth-child(1) > div.sc-jrrXlR.bfvaMp.flex.justify-between.items-center.mt-4 > div.card-actions > button.sc-crozmw.sc-jJTsDX.jrDktB.TnOul.flex.justify-center.items-center.h-9.w-9.transition.ease-in-out.delay-150.duration-300';
        await this.clickElement(deleteButtonSelector);
       // await this.waitForTimeout(4000);
        await this.searchNotExistedProduct(itemTitle);
        const result = await this.page.textContent('#root > div > main > div > div > div > div.flex.flex-col.justify-center > p');
        console.log(result);
        return result;
    }

    async editProduct() {
        const editProductButtonSelector = '#root > div > main > div > div > div > div.grid.grid-cols-4.gap-7 > div:nth-child(1) > div.sc-jrrXlR.bfvaMp.flex.justify-between.items-center.mt-4 > div.card-actions > button:nth-child(1)';
        await this.clickElement(editProductButtonSelector);

        const randomProductName = faker.commerce.productName();
        const randomDescription = this.generateRandomDescription(40);
        const randomPrice = faker.datatype.number({ min: 1, max: 1000 }).toString();

        await this.fillInputField('input[name="title"]', randomProductName);
        await this.fillInputField('input[name="description"]', randomDescription);
        await this.fillInputField('input[name="price"]', randomPrice);

        await this.clickElement('//*[@id="root"]/div/main/div/form/button');

        await this.waitForSelector('input[placeholder="Search for products ..."]');

        return randomProductName;
    }

    generateRandomDescription(minLength: number): string {
        let description = '';

        while (description.length < minLength) {
            description = faker.lorem.paragraph();
        }

        description = description.substring(0, minLength);
        return description.trim();
    }
}
