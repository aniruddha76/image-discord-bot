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
    var images = document.querySelectorAll("img");

    await Promise.all(images.map(async (image) => {
        let urls = image.getAttribute('src');

        if (urls.split("/")[3].includes("x")) {
            let modifiedUrl = urls.replace(urls.split("/")[3], "originals");
            let response = fetch(modifiedUrl);
            if ((await response).status === 200) {
                imageUrl.add(modifiedUrl)
            } else {
                let modifiedUrl2 = modifiedUrl.replace(modifiedUrl.split(".")[3], "webp");
                imageUrl.add(modifiedUrl2);
            }
        }
    }));

    // console.log(imageUrl);
    return imageUrl;
}
run()
export default run;
