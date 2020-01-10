# GitHub & Clubhouse Owner Sync

<p align="center">
    <img height="400" src="/images/logo.png">
    </br>
    <a href="https://zeit.co/new/project?template=https://github.com/maxchehab/github-clubhouse-owner-sync">
        <img src="https://zeit.co/button" alt="Deploy to ZEIT Now" />
    </a>
</p>

This is a standalone application which updates the Owner of a Clubhouse Story when a targeted branch is pushed inside a GitHub organization. This works by providing a configurable dashboard to sync your Clubhouse and GitHub member directories and providing a GitHub event endpoint for created branches within an organization.

# Setup and Installation

This application is intended to be hosted with [Zeit](https://zeit.co/workos). To start, press the Deploy button and select the "Create Git repository" when prompted. _It is essential that this repository is forked due to GitHub Action requirements._

## Secret Setup

Once you have navigated to the project template, you will be required to fill out the following secrets:

- [`CLUBHOUSE SECRET`](#clubhouse-setup)
- [`FAUNA SECRET`](#fauna-and-migration-setup)
- [`GITHUB OAUTH CLIENT ID`](#github-oauth-credentials)
- [`GITHUB OAUTH CLIENT SECRET`](#github-oauth-credentials)
- [`GITHUB ORG HOOK SECRET`](#github-organization-webhook)
- [`GITHUB ORG ID`](#github-org-id)

### Clubhouse setup

This application requires a Clubhouse secret to perform the following actions:

- List the member directory of your Clubhouse organization
- Update a Story's owner

To issue a Clubhouse secret navigate to your [organizations settings](https://app.clubhouse.io/settings/account/api-tokens) and generate a new API Token.

Save this API Token as the required `CLUBHOUSE SECRET` in Zeit's template onboarding form.

### Fauna and Migration setup

This application uses Fauna, a serverless data-store, as a data layer. Included with this repository is suite of GitHub actions that execute migrations when master is pushed. When this project is initially forked, this action will fail due to a missing Fauna Secret.

1. [Login or create a Fauna account.](https://fauna.com/)
2. [Create a new database.](https://dashboard.fauna.com/db-new/)
3. Issue a new key by selecting the Security label in the sidebar.
4. Save this key as a `FAUNA_SECRET` variable in your forked repositories [Secret Settings](/settings/secrets) _/settings/secrets_
5. Save this key as the required `FAUNA SECRET` in Zeit's template onboarding form.

### GitHub OAuth Credentials

This application registers as a customer GitHub OAuth application to perform the following actions:

- Verify members of your GitHub organization to access the managed dashboard.
- List the member directory of your GitHub organization

To create an set of OAuth Credentials:

1. Navigate to https://github.com/settings/applications/new
2. Fill out the following fields like so:
   <p align="left"><img height="400" src="/images/oauth-settings.png"></p>
3. Create a temporary **Authorization callback URL**. You will be required to change this later within the setup.
4. Save the **Client ID** as the required `GITHUB OAUTH CLIENT ID` in Zeit's template onboarding form.
5. Save the **Client Secret** as the required `GITHUB OAUTH CLIENT SECRET` in Zeit's template onboarding form.

### GitHub Organization Webhook

This application requires a registered Organization Webhook to be notified when a new branch has been created. The webhook created will be authenticated by a signed signature from a user provided secret.

To create an Organization Webhook:

1. Be an Organization Owner
2. Create a new Organization Webhook `https://github.com/organizations/{org-name}/settings/hooks/new`
3. Fill out the following fields like so:
   <p align="left"><img height="400" src="/images/webhook-settings.png"></p>
4. Create a temporary **Payload URL**. You will be required to change this later within the setup.
5. Assert that you **only** have **Branch or tag creation** selected.
6. Save the **Secret** you generated as the required `GITHUB ORG HOOK SECRET` in Zeit's template onboarding form.

### GitHub Org ID

The required `GITHUB ORG ID` is simply the string of your organization's name.
