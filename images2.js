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

async function getImages(name){
    let firstName;
    let lastName;
    let extraName;
    let celebName;
    let links = []

    if (name.split(" ").length == 3) {
        firstName = name.split(" ")[0];
        lastName = name.split(" ")[1];
        extraName = name.split(" ")[2];
        celebName = firstName + "-" + lastName + "-" + extraName;
    } else {
        firstName = name.split(" ")[0];
        lastName = name.split(" ")[1];
        celebName = firstName + "-" + lastName;
    }

    let url = `https://scandalplanet.com/${celebName}/`

    let res = await getHtml(url);
    let document = parse(res);

    if(document.innerHTML.includes('page not found')){
        imageUrl.add("Oops! It seems like the celebrity you're looking for is not found. Please double-check the spelling or try searching for another celebrity.")
    }

    let images = document.querySelectorAll('img.attachment-large')
    images.forEach((img) => {
        let src = img.parentNode.rawAttrs
        links.push(src.split("'")[1])
    })

    shuffleArray(links);
    let imagesLinks = new Set(links)
    return imagesLinks
}

export default getImages;