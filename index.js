// ==UserScript==
// @name         Steam Review Other lang Calculation
// @name:zh-CN   Steam评测其他语言好评率计算
// @namespace    https://controlnet.space/
// @version      2024-03-26
// @description  Calculate steam review positive rate for other languages.
// @description:zh-CN 计算steam消费者评测中其他语言的好评率。
// @author       ControlNet
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      agpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/490957/Steam%20Review%20Other%20lang%20Calculation.user.js
// @updateURL https://update.greasyfork.org/scripts/490957/Steam%20Review%20Other%20lang%20Calculation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (document.getElementsByTagName("html")[0].getAttribute("lang") !== "zh-cn") {
        return;
    }

    const lang_review = document.querySelector("div.reviews_info_ctn > div.user_reviews_filter_score")
    let domNodeInserted = false

    lang_review.addEventListener("DOMNodeInserted", function() {
        if (domNodeInserted) {
            return
        }
        domNodeInserted = true
        const reviewScores = []
        const pattern = /此游戏的 (.+?) 篇用户评测中有 (\d+?)% 为好评。/

        document.querySelectorAll("span.game_review_summary").forEach(node => {
            const tooltip = node.getAttribute("data-tooltip-html")
            if (tooltip === null) {
                return
            }
            const match = pattern.exec(tooltip)
            if (match === null) {
                return
            }
            reviewScores.push({
                num: +match[1].replace(",", ""),
                score: +match[2] / 100
            })
        })
        const [overallScore, langScore] = reviewScores
        const otherLangNum = overallScore.num - langScore.num
        const otherLangPositive = Math.round(overallScore.num * overallScore.score - langScore.num * langScore.score)
        const otherLangPercent = Math.round(otherLangPositive / otherLangNum * 100)
        const message = `其他语言的 ${otherLangNum} 用户评测中有 ${otherLangPercent}% 为好评。`
        lang_review.insertAdjacentHTML("beforeend", `<div>${message}</div>`)
    })
})();
