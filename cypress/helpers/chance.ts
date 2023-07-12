import { Chance } from "chance";

export class ChanceService {
    generateRandomName(): string {
        return Chance().name();
    }

    generateRandomCnpj(): string {
        return Chance().natural({min: 11111111111111, max: 99999999999999}).toString();
    }

    generateRandomMail(): string {
        return Chance().email()
    }
}