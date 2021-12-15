const puppeteer = require('puppeteer-core');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

const browserURL = 'http://127.0.0.1:9222';
const ps5_url = 'https://www.walmart.com/ip/Sony-PlayStation-5-Video-Game-Console/165545420';
const rand_url = 'https://www.walmart.com/ip/Nike-Drop-Type-HBR-White-University-Red-White-CQ0989-103-Men-s-Size-12-Medium/562434826?athbdg=L1400';


async function initBrowser(){
    const browser = await puppeteer.connect({browserURL, defaultViewport: null});
    const page = await browser.newPage();
    await page.goto(rand_url);
    return page;
}

async function sendNotifications(){

    let transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: 'ahmadmeselmani.2000@outlook.com',
            pass: 'Ahmad@2000'
        }
    });

    let textToSend = 'Go get the playstation 5!';
    let htmlText = `<a href=\"${rand_url}\">Walmart Fucking Drop :))</a>`;

    let info = await transporter.sendMail({
        from: '"Walmart Monitor" <ahmadmeselmani.2000@outlook.com>',
        to: 'blackent151@gmail.com',
        subject: 'Playstation 5 is in stock',
        text: textToSend,
        html: htmlText
    });

    console.log("Message sent %s", info.messageId);
}


async function checkStock(page){
    await page.reload();
    let content = await page.evaluate(() => document.head.innerText);
    let out_of_stock = content.toLowerCase().includes('outofstock');  

    // loop through text and find if InStock || OutOfStock
    if(out_of_stock){
        console.log('out of stock');
    } else {
       await sendNotifications();
    }  

}

async function monitor(){
    const page = await initBrowser();
    let job = new CronJob("*/60 * * * *", function(){
        checkStock(page);
    }, null, true, null, null, true);
    job.start();
}

monitor();


 