// 引用line機器人套件
import linebot from 'linebot'
// 引用 dotenv 套件
import dotenv from 'dotenv'
// 引用axios套件
import axios from 'axios'

import schedule from 'node-schedule'

// 讀取.env
dotenv.config()

let informations = []

const updateDate = async () => {
  const response = await axios.get('https://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx')
  informations = response.data
}

schedule.scheduleJob('0 0 0 * * *', function () {
  updateDate()
})
updateDate()
// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async (event) => {
  try {
    let reply = ''
    let reply2 = ''
    const text = event.message.text
    if (text === 'flex') {
      reply2 = {
        type: 'flex',
        altText: 'Flex',
        contents: [
          {
            type: 'bubble',
            hero: {
              type: 'image',
              url: 'https://cc.tvbs.com.tw/img/program/_data/i/upload/2017/04/21/20170421152859-3c494080-me.jpg',
              size: 'full',
              aspectRatio: '20:13',
              aspectMode: 'cover',
              action: {
                type: 'uri',
                uri: 'http://linecorp.com/'
              }
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '蔬果查價',
                  weight: 'bold',
                  size: 'xl'
                }
              ],
              backgroundColor: '#E9F5DF'
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                {
                  type: 'button',
                  style: 'link',
                  height: 'sm',
                  action: {
                    type: 'message',
                    label: '直接輸入菜名',
                    text: 'EX:白菜、西瓜......'
                  },
                  color: '#5D8C54'
                },
                {
                  type: 'button',
                  style: 'link',
                  height: 'sm',
                  action: {
                    type: 'uri',
                    label: 'WEBSITE',
                    uri: 'https://www.twfood.cc/'
                  },
                  color: '#5D8C54'
                },
                {
                  type: 'spacer',
                  size: 'sm'
                }
              ],
              flex: 0
            }
          }
        ]
      }
      event.reply(reply2)
    }

    for (const inform of informations) {
      if (inform.作物名稱.includes(text)) {
        reply += `${inform.市場名稱}市場 : ${inform.作物名稱}的平均價格${inform.平均價}` + '\n'
      }
    }
    reply = (reply.length === 0) ? '找不到呦~~~' : reply
    event.reply(reply)
  } catch (error) {
    event.reply('發生錯誤')
  }
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
