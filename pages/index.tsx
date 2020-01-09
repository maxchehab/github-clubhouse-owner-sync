import { Component } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';

interface Props {
  session: string;
}

export default class extends Component<Props> {
  static async getInitialProps(ctx: NextPageContext) {
    if (ctx.res) {
      const { sid } = parseCookies(ctx);

      if (!sid) {
        ctx.res.writeHead(302, {
          Location: '/login',
        });
        ctx.res.end();
      }

      return { session: ctx.req.headers.cookie };
    }
  }

  render() {
    return <h1>{this.props.session}</h1>;
  }
}
