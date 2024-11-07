from bs4 import BeautifulSoup
import asyncio
from pyppeteer import launch

url = "https://www.youtube.com/playlist?list=PLFP9n74EIJVDwB4kTfGSJcehdLdDbWWY3"

async def get_page(url):
    browser = await launch()
    page = await browser.newPage()
    await page.goto(url)
    page = await page.content()
    dom = BeautifulSoup(page,'html.parser')
    links = dom.find_all(id='video-title')
    for link in links:
        youtube_link = "https://www.youtube.com"+link['href']
        print(youtube_link)

asyncio.get_event_loop().run_until_complete(get_page(url))

