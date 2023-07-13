/// <reference types="cypress" />
interface CreateCompany {
    name: string,
	cnpj: string,
	email: string,
	phone: string,
	address: string,
	username: string,
	password: string
}

Cypress.Commands.add('createCompany', (payload:CreateCompany) => {
    cy.request({
        url: `${Cypress.env("baseUrl")}/company`,
        method: "POST",
        headers: {
            "api_token": Cypress.env("apiToken")
        },
        body: payload
    }).then(res => {
        return cy.wrap(res.body.data.id)
    })
})

declare namespace Cypress {
    interface Chainable<Subject> {
        createCompany(payload:CreateCompany);
    }
}