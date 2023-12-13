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
        try{
        let urls = image.parentNode.rawAttributes.href;

        if(urls.includes(celebFirstName)){
            if(urls.startsWith("https:") && !urls.endsWith(".html")){

                imageUrl.add(urls)

            } else if(!urls.startsWith("https:") && !urls.endsWith(".html")) {

                let newUrl = "https:" + urls;
                imageUrl.add(newUrl);

            } else if(!urls.startsWith("https:") && urls.endsWith(".html")){
                let newUrl = "https://www.aznude.com" + urls;
                let response = await getHtml(newUrl);
                let document = parse(response);
                let video = document.querySelectorAll('.videoButtons').filter(element => element._attrs.class === 'videoButtons');
                let href = video.filter(element => element.rawAttrs)[2].parentNode.rawAttrs;
                let newVidUrl = "https:" + href.split('"')[1];
                imageUrl.add(newVidUrl)
            }
        }
    } catch (error) {}

        // if (urls.split("/")[3].includes("x")) {
        //     let modifiedUrl = urls.replace(urls.split("/")[3], "originals");
        //     let response = fetch(modifiedUrl);
        //     if ((await response).status === 200) {
        //         imageUrl.add(modifiedUrl)
        //     } else {
        //         let modifiedUrl2 = modifiedUrl.replace(modifiedUrl.split(".")[3], "webp");
        //         imageUrl.add(modifiedUrl2);
        //     }
        // }
    }));

    return imageUrl;
}

export default run;
