function doGet(e) {
  return HtmlService.createTemplateFromFile('src/views/Index')
    .evaluate()
    .setTitle('Daily Status Report')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
