const tableToJSON = require('tabletojson')
const fs = require('fs');
const {JSDOM} = require("jsdom");
const {document} = new JSDOM("").window
const stripHtmlComments = require('strip-html-comments');
const AdmZip = require("adm-zip");
const { v4: uuid } = require('uuid');
const Axios = require("axios")
const path = require("path")
const Downloader = require('nodejs-file-downloader');

const downloadFile = async (fileUrl, outputLocationPath)  => {
    const writer = fs.createWriteStream(outputLocationPath);

    return Axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(response => {

        //ensure that the user can call `then()` only when the file has
        //been downloaded entirely.
        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                if(err.status === 404){
                    const error = new Error('Invalid File input')
                    error.statusCode = 404
                    error.cause = "URL File Invalid"
                    throw error
                    reject(error)
                }else{
                    reject(err);
                }
            });
            writer.on('close', () => {
                if (!error) {
                    resolve(true);
                }
                //no need to call the reject here, as it will have been called in the
                //'error' stream;
            });
        });
    });
}




const fromWebPageParser = async (htmlFile) => {
    const html = await fs.promises.readFile(htmlFile,'utf8');
    const htmlNoClass =  await deleteAllClassFromHtmlString(html);
    const extracted = tableToJSON.Tabletojson.convert(htmlNoClass)
    const kunjawIndex = extracted[0].length - 1
    const result = extracted.map((value, index) => {
        const currentSoal = extracted[index]
        const pilihanArray = currentSoal.filter((valueCurrentSoal, currentIndex) => {
            return currentIndex!== kunjawIndex && currentIndex !== 0
        }).map((pilihanValue) => {
            return {
                kunciPilihan: pilihanValue[1],
                pilihan: pilihanValue[2]
            }
        })
        return{
            no: index + 1,
            soal: currentSoal[0][2],
            pilihan: pilihanArray,
            kunjaw: currentSoal[kunjawIndex][2]
        }
    })
    return result
}
const walk_the_DOM = function walk(node, func) {
    func(node);
    node = node.firstChild;
    while (node) {
        walk(node, func);
        node = node.nextSibling;
    }
};

const deleteAllClassFromHtmlString = async (htmlString) => {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = htmlString
    walk_the_DOM(wrapper, function(el) {
        if(el.removeAttribute) {
            el.removeAttribute('id');
            el.removeAttribute('style');
            el.removeAttribute('class');
            el.removeAttribute('v:shapes')
        }
    });
    const deleteAllComment = stripHtmlComments(wrapper.innerHTML)
    return deleteAllComment
}

exports.extractDocxFromURL = async (fileURL) => {
    const zippedFileDownloadBaseURL = "public/docx/original/zip"
    const randomFileName = `${uuid()}.zip`
    const randomName = `${zippedFileDownloadBaseURL}/${randomFileName}`
    const downloadAder = new Downloader({
        url : fileURL,
        directory: zippedFileDownloadBaseURL,
        fileName: randomFileName,
        cloneFiles:false,
        onProgress:function(percentage,chunk,remainingSize){//Gets called with each chunk.
            console.log('% ',percentage)
            console.log('Current chunk of data: ',chunk)
            console.log('Remaining bytes: ',remainingSize)
        }
    })
    await downloadAder.download()
    const zip = new AdmZip(randomName)
    const zipEntries = zip.getEntries()
    let htmlFileName = "";
    zipEntries.find(entry=> {
        if(entry.entryName.includes(".html")){
            htmlFileName = entry.entryName
            return true
        }
    })
    console.log(`HTML Filename adalah ${htmlFileName}`)
    const newFolderName = uuid()
    const destination = `public/docx/original/extracted/${newFolderName}`
    zip.extractAllTo(destination,true);
    console.log("Extract beres loh")
    var extractedHtml = await fromWebPageParser(`${destination}/${htmlFileName}`)
    deleteFile(randomName)
    return extractedHtml
}
const deleteFile = (filePath) => {
    filePath = path.join(__dirname, "..", "..", filePath.replace(/\\/gi, "/"));
    fs.unlink(filePath, (err) => console.log(err));
};

