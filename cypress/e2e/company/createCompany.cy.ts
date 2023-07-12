import { ChanceService } from "../../helpers/chance";

describe("Create Company Tests", () => {
    let payload;
    let chanceService = new ChanceService();

    before(() => {
        cy.fixture("createCompany.json").then(res => {
            payload = res;
            payload.cnpj = chanceService.generateRandomCnpj();
            payload.email = chanceService.generateRandomMail();
            payload.username = chanceService.generateRandomName();
        })
    })

    it("Create new company", () => {
        cy.request({
            url: `${Cypress.env("baseUrl")}/company`,
            method: "POST",
            headers: {
                "api_token": Cypress.env("apiToken")
            },
            body: payload
        }).then(res => {
            expect(res.body.data).not.null;
            expect(res.body.data.id).not.null;
            expect(res.body.data.name).contain(payload.name);
        })
    })

    it("Not send api token", () => {
        cy.request({
            url: `${Cypress.env("baseUrl")}/company`,
            method: "POST",
            body: payload,
            failOnStatusCode: false
        }).then(res => {
            expect(res.status).equal(403);
        })
    })

    it("Send empty payload value", () => {
        const invalidPayload = {
            "name": "Cypress Company Test",
            "cnpj": "",
            "email": "cypress@mail.com",
            "phone": "41999999999",
            "address": "av cypress, 1999",
            "username": "cypress",
            "password": "123"
        };
        cy.request({
            url: `${Cypress.env("baseUrl")}/company`,
            method: "POST",
            headers: {
                "api_token": Cypress.env("apiToken")
            },
            body: invalidPayload,
            failOnStatusCode: false
        }).then(res => {
            expect(res.body.status).equal(400);
            expect(res.body.message).equal("Todos os campos devem ser preenchidos.")
        })
    })

    it("Send duplicated data", () => {
        cy.request({
            url: `${Cypress.env("baseUrl")}/company`,
            method: "POST",
            headers: {
                "api_token": Cypress.env("apiToken")
            },
            body: payload,
            failOnStatusCode: false
        }).then(res => {
            expect(res.status).equal(400)
            expect(res.body.message).equal("Erro, verifique se já existe uma compania cadastrada.")
        })
    })
})
