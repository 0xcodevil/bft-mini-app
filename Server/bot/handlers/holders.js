const Bot = require('../index');
const { InlineKeyboard } = require('grammy');
const { GraphQLClient, gql } = require('graphql-request');

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/97875/shroomy/version/latest';
const client = new GraphQLClient(SUBGRAPH_URL)

const query = gql`
  query HolderStat {
    holderStat(id: "global") {
      spore
      mycelium
      shroomasseur
      shroominator
      shroomlord
    }
  }
`

const keyboard = new InlineKeyboard().url('🍄Buy Shroomy🍄', 'https://superswap.ink/?token1=0x0c5E2D1C98cd265C751e02F8F3293bC5764F9111&token0=0x4200000000000000000000000000000000000006')

const attachHoldersHandler = () => {
  Bot.command("holders", async (ctx) => {
    // const data = await fetch('https://explorer.inkonchain.com/api/v2/tokens/0x0c5E2D1C98cd265C751e02F8F3293bC5764F9111');
    // const json = await data.json();

    // ctx.reply(`SHROOMY holders: *${Number(json.holders).toLocaleString()}*`, {
    //   parse_mode: 'MarkdownV2'
    // });

    try {
      const data = await client.request(query);

      ctx.reply(
        `
🍄 *Real SHROOMY holders* 🍄

Spores \\(\\<50K\\): *${data.holderStat.spore}*
Mycelium \\(50K \\- 250K\\): *${data.holderStat.mycelium}*
Shroomasseurs \\(250K \\- 750K\\): *${data.holderStat.shroomasseur}*
Shroominators \\(750K \\- 2\\.5M\\): *${data.holderStat.shroominator}*
Shroom Lords \\(\\>2\\.5M\\): *${data.holderStat.shroomlord}*

Total Shroomies: *${data.holderStat.spore + data.holderStat.mycelium + data.holderStat.shroomasseur + data.holderStat.shroominator + data.holderStat.shroomlord}*
`, { parse_mode: 'MarkdownV2', reply_markup: keyboard }
      );
    } catch (err) {
      ctx.reply('Can\'t fetch holders!', { reply_parameters: { message_id: ctx.msg.message_id } });
    }
  });
}

module.exports = attachHoldersHandler;