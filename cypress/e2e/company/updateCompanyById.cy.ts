import { ChanceService } from "../../helpers/chance";

describe("Update Company Tests", () => {
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

    it("Update company by id", () => {
        cy.createCompany(payload).then(companyId => {
            let updatePayload = payload;
            updatePayload.name = "updated name test";
            updatePayload.companyid = companyId;

            cy.request({
                url: `${Cypress.env("baseUrl")}/company`,
                method: "PUT",
                headers: {
                    "api_token": Cypress.env("apiToken")
                },
                body: updatePayload
            }).then(res => {
                expect(res.status).equal(200);
                expect(res.body.data.name).equal("updated name test");
            })
        })
    })

    it("Send invalid api token", () => {
        cy.createCompany(payload).then(companyId => {
            let updatePayload = payload;
            updatePayload.name = "updated name test";
            updatePayload.companyid = companyId;

            cy.request({
                url: `${Cypress.env("baseUrl")}/company`,
                method: "PUT",
                headers: {
                    "api_token": "invalid"
                },
                body: updatePayload
            }).then(res => {
                expect(res.status).equal(403);
                expect(res.body).equal("Usuário sem acesso, verifique com um administrador.");
            })
        })
    })

    it("Send invalid company id", () => {
        cy.createCompany(payload).then(companyId => {
            let updatePayload = payload;
            updatePayload.name = "updated name test";
            updatePayload.companyid = "0000";

            cy.request({
                url: `${Cypress.env("baseUrl")}/company`,
                method: "PUT",
                headers: {
                    "api_token": Cypress.env("apiToken")
                },
                body: updatePayload,
                failOnStatusCode: false
            }).then(res => {
                expect(res.status).equal(400);
                expect(res.body.message).equal("Nenhuma compania localizada com o ID informado, tente novamente.");
            })
        })
    })

    it.only("Send empty payload value", () => {
        cy.createCompany(payload).then(companyId => {
            let updatePayload = payload;
            delete updatePayload.name;
            updatePayload.companyid = companyId;

            cy.request({
                url: `${Cypress.env("baseUrl")}/company`,
                method: "PUT",
                headers: {
                    "api_token": Cypress.env("apiToken")
                },
                body: updatePayload,
                failOnStatusCode: false
            }).then(res => {
                expect(res.status).equal(400);
                expect(res.body.message).equal("Todos os campos devem ser preenchidos.");
            })
        })
    })
})