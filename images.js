import { parse } from "node-html-parser";

async function getHtml(url) {
    let response = await fetch(url);
    if (response.status == 200) {
        var responseText = await response.text();
        return responseText;
    } else {
        return "<html><body>page not found</body></html>";
    }

}

async function shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
}

async function run(nameToSearch) {
    let userWant = nameToSearch.toLowerCase();

    let celebFirstName = userWant.split(" ")[0];
    let celebLastName = userWant.split(" ")[1];
    let celebName = celebFirstName.split("")[0] + "/" + celebFirstName + celebLastName;

    let imageUrl = new Set();

    let html = await getHtml(``);

    let document = parse(html);
    var images = document.querySelectorAll("a img");

    await Promise.all(images.map(async (image) => {
        try {
            let urls = image.parentNode.rawAttributes.href;

            if (urls.includes(celebFirstName)) {
                if (urls.startsWith("https:") && !urls.endsWith(".html")) {

                    imageUrl.add(urls)

                } else if (!urls.startsWith("https:") && !urls.endsWith(".html")) {

                    let newUrl = "https:" + urls;
                    imageUrl.add(newUrl);

                } else if (!urls.startsWith("https:") && urls.endsWith(".html")) {
                    let newUrl = "" + urls;
                    let response = await getHtml(newUrl);
                    let document = parse(response);
                    let video = document.querySelectorAll('.videoButtons').filter(element => element._attrs.class === 'videoButtons');
                    let href = video.filter(element => element.rawAttrs)[2].parentNode.rawAttrs;
                    let newVidUrl = "https:" + href.split('"')[1];
                    imageUrl.add(newVidUrl)
                }
            }
        } catch (error) { }
    }));

    let urlArray = Array.from(imageUrl);
    shuffleArray(urlArray)
    imageUrl = new Set(urlArray)

    return imageUrl;
}

export default run;
