import { WebClient } from '@slack/web-api';

const web = new WebClient(process.env.SLACK_TOKEN);

export async function postDeployConfirmationMessage() {
  const result = await web.chat.postMessage({
    channel: process.env.SLACK_CHANNEL as string,
    text: 'Staging is *five* commits behind Production',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Staging is *five* commits behind Production',
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            '*#1639 <https://github.com/workos-inc/workos/pull/1639|Adds UsersOrganizations entity and dual writing on organization...>*',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            '*#1639 <https://github.com/workos-inc/workos/pull/1639|Adds UsersOrganizations entity and dual writing on organization...>*',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            '*#1639 <https://github.com/workos-inc/workos/pull/1639|Adds UsersOrganizations entity and dual writing on organization...>*',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            '*#1639 <https://github.com/workos-inc/workos/pull/1639|Adds UsersOrganizations entity and dual writing on organization...>*',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            '*#1639 <https://github.com/workos-inc/workos/pull/1639|Adds UsersOrganizations entity and dual writing on organization...>*',
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '_We suggest you QA staging before promoting._',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: '*Staging Dashboard*',
          },
          {
            type: 'mrkdwn',
            text: 'https://dashboard.workos-test.com',
          },
          {
            type: 'mrkdwn',
            text: '*Staging API*',
          },
          {
            type: 'mrkdwn',
            text: 'https://api.workos-test.com',
          },
        ],
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            style: 'primary',
            text: {
              type: 'plain_text',
              text: 'Promote Staging',
            },
            value: 'promote',
          },
        ],
      },
    ],
  });
}
