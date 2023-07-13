import { ChanceService } from "../../helpers/chance";

describe("Find Company Tests", () => {
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
    
    it("Find company by id", () => {    
        cy.createCompany(payload).then(companyId => {
            cy.request({
                url: `${Cypress.env("baseUrl")}/company/${companyId}`,
                method: "GET",
                headers: {
                    "api_token": Cypress.env("apiToken")
                },
            }).then(res => {
                expect(res.status).equal(200);
                expect(res.body.data.id).equal(companyId);
            })

        });
    })

    it("Send invalid company id", () => {
        cy.request({
            url: `${Cypress.env("baseUrl")}/company/00000000`,
            method: "GET",
            headers: {
                "api_token": Cypress.env("apiToken")
            },
        }).then(res => {
            expect(res.status).equal(200);
            expect(res.body.data).to.be.null;
        })
    })

    it("Send invalid api token", () => {
        const updatedPayload = {
            "name": "Cypress Company Test",
            "cnpj": "99999999999999",
            "email": "cypress2@mail.com",
            "phone": "41999999999",
            "address": "av cypress, 1999",
            "username": "cypress2",
            "password": "123"
        };

        cy.createCompany(updatedPayload).then(companyId => {
            cy.request({
                url: `${Cypress.env("baseUrl")}/company/${companyId}`,
                method: "GET",
                headers: {
                    "api_token": "00000000"
                },
                failOnStatusCode: false
            }).then(res => {
                console.log(res)
                expect(res.status).equal(403);
                expect(res.body).equal("Usuário sem acesso, verifique com um administrador.");
            })

        });
    })
})