const analyzeButton = document.getElementById('analyze')!!
const numbers = document.getElementById('numbers')!!
const price = document.getElementById('price')!!
const tweetButton = document.getElementById('tweet') as HTMLAnchorElement

analyzeButton.addEventListener('click', function () {
    this.textContent = 'Analyzing...'
    chrome.runtime.sendMessage('analyze', result => {
        if (result != null) {
            const purchaseResult = result as PurchaseResult
            this.style.display = 'none'
            numbers.textContent = `総購入作品数: ${purchaseResult.worksCount}`
            price.textContent = `総額: ${purchaseResult.totalPrice}円`
            const tweetContent = `私はDLsiteにこれだけ溶かしました\n購入作品数: ${purchaseResult.worksCount}作品\n合計金額: ${purchaseResult.totalPrice}円\n`
            tweetButton.style.display = 'block'
            tweetButton.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetContent)}`
        } else {
            this.textContent = '失敗しました。ページをリロードして再試行してください。'
        }
    })
})
