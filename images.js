import { parse } from "node-html-parser";

let imageUrl = new Set();

    async function getHtml(url) {
        let response = await fetch(url);
        if (response.status == 200) {
            var responseText = await response.text();
            return responseText;
        } else {
            return "<html><body>page not found</body></html>";
        }

    }

    async function run() {
        let html = await getHtml("https://pinterest.com/albert_12_12/teagan-croft/");

        let document = parse(html);
        var urlLoop = document.querySelectorAll("img");

        // console.log(loop);
        for (let i = 0; i < urlLoop.length; i++) {
            let urls = urlLoop[i].getAttribute("src");
            imageUrl.add(urls)
        }

        return imageUrl;
};
export default run;
