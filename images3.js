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

async function getImageLinks(document, imageLinks) {
    Array.from(document.querySelectorAll('.attachment-bh_255_auto')).forEach(element => {
        let url = element.attrs.src
        
        // Use a regular expression to remove the resolution part
        let modifiedUrl = url.replace(/-\d+x\d+(\.\w+)$/, '$1');
        imageLinks.push(modifiedUrl)
    })
}

async function getBollywoodImages(name) {
    let firstName = name.split(' ')[0]
    let lastName = name.split(' ')[1]
    let imageLinks = []

    let res = await getHtml(`https://www.bollywoodhungama.com/photos/celeb-photos/${firstName}-${lastName}/`)
    let document = parse(res);

    await getImageLinks(document, imageLinks)
    
    for(let i=0; i<4; i++){
        let res = await getHtml(`https://www.bollywoodhungama.com/photos/celeb-photos/${firstName}-${lastName}/page/${i}/`)
        let document = await parse(res);

        await getImageLinks(document, imageLinks)
    }

    shuffleArray(imageLinks)
    let linkSet = new Set(imageLinks)
    return linkSet
}

export default getBollywoodImages;

// let res = await getHtml('https://www.google.com/search?q=urvashi+rautela+hot&sca_esv=c22b2ea343d7758c&source=hp&biw=1366&bih=607&ei=WrRuZuzqH4Xn2roPnpqNsAQ&iflsig=AL9hbdgAAAAAZm7CalA9KKoFvr8Zsynmk6zlsMSpkKTA&oq=avneet+&gs_lp=EgNpbWciB2F2bmVldCAqAggDMggQABiABBixAzIIEAAYgAQYsQMyBRAAGIAEMgQQABgDMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAESPMcUJQHWJUOcAB4AJABAJgBogGgAe8HqgEDMC43uAEDyAEA-AEBigILZ3dzLXdpei1pbWeYAgegAuoIqAIAwgILEAAYgAQYsQMYgwGYAwuSBwMwLjegB7oi&sclient=img&udm=2')
// let document = parse(res);

// let next = document.querySelector('.frGj1b')._attrs.href
// console.log(next)

// let res2 = await getHtml(`https://www.google.com/${next}`)
// console.log(res2)

