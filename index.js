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
    const text = event.message.text
    let reply = ''
    for (const inform of informations) {
      if (inform.作物名稱.includes(text)) {
        reply += inform.作物名稱 + '\n'
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
