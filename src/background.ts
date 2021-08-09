type Work = {
    date: string
    price: number
}

type PurchaseResult = {
    worksCount: number
    totalPrice: number
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if (message == 'analyze') {
        readAllWorks(1).then(works => {
            const result = {
                worksCount: works.length,
                totalPrice: works.map(w => w.price).reduce((previousValue, currentValue) => {
                    return previousValue + currentValue
                }, 0)
            }
            console.log(result)
            sendResponse(result)
        }).catch( e => {
            console.log(e)
            sendResponse(null)
        })
    } else {
        sendResponse(null)
    }
    return true
})

async function readAllWorks(page: number): Promise<Array<Work>> {
    const url = `https://www.dlsite.com/maniax/mypage/userbuy/=/type/all/start/all/sort/1/order/1/page/${page}`
    const result = await (await fetch(url, { mode: 'no-cors' })).text()
    const parser = new DOMParser()
    const document = parser.parseFromString(result, 'text/html')
    const works = Array.from(
        document.getElementsByClassName('work_list_main')[0]
            .getElementsByTagName('tbody')[0].children
    ).slice(1).map((e: Element) => {
        return {
            date: e.getElementsByClassName('buy_date')[0].textContent!!,
            price: parseInt(e.getElementsByClassName('work_price')[0].textContent!!.replace(/[^0-9]/, ''))
        }
    })
    const ul = document.getElementsByClassName('page_no')[0]
        .getElementsByTagName('ul')
    const hasNextPage = ul.length !== 0 && Array.from(ul[0].children).find(e => e.textContent === '次へ') !== undefined
    if (hasNextPage) {
        return works.concat(await readAllWorks(page + 1))
    } else {
        return works
    }
}
